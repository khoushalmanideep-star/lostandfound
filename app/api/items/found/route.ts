import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createNotification } from "@/lib/notifications";
import { createServiceRoleSupabaseClient } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const title = String(formData.get("title") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim();
    const color = String(formData.get("color") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const location = String(formData.get("location") ?? "").trim();
    const dateFound = String(formData.get("dateFound") ?? "").trim();
    const image = formData.get("image");

    if (!title || !category || !color || !description || !location || !dateFound) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const profile = await currentUser();
    const email = profile?.emailAddresses[0]?.emailAddress ?? `${userId}@clerk.local`;
    const name = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || "Student";

    const supabase = createServiceRoleSupabaseClient();

    const { data: userRecord, error: userError } = await supabase
      .from("users")
      .upsert(
        {
          clerk_id: userId,
          name,
          email,
        },
        { onConflict: "clerk_id" },
      )
      .select("id")
      .single();

    if (userError || !userRecord) {
      return NextResponse.json({ error: "Failed to upsert user." }, { status: 500 });
    }

    let imageUrl: string | null = null;
    if (image instanceof File && image.size > 0) {
      const extension = image.name.split(".").pop() ?? "jpg";
      const path = `found/${userId}/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage.from("item-images").upload(path, image, {
        contentType: image.type || "application/octet-stream",
        upsert: false,
      });

      if (uploadError) {
        return NextResponse.json(
          { error: "Image upload failed. Ensure storage bucket `item-images` exists." },
          { status: 500 },
        );
      }

      const { data: publicImage } = supabase.storage.from("item-images").getPublicUrl(path);
      imageUrl = publicImage.publicUrl;
    }

    const { data: createdFoundItem, error: insertError } = await supabase
      .from("items")
      .insert({
        type: "found",
        title,
        category,
        color,
        description,
        location,
        image_url: imageUrl,
        status: "open",
        user_id: userRecord.id,
        date_found: dateFound,
      })
      .select("id,title,category,color,location,description,user_id")
      .single();

    if (insertError || !createdFoundItem) {
      return NextResponse.json({ error: "Failed to create found item post." }, { status: 500 });
    }

    const normalizedColor = color.toLowerCase();
    const normalizedLocation = location.toLowerCase();
    const normalizedTitle = title.toLowerCase();
    const normalizedDescription = description.toLowerCase();

    const { data: candidateLostItems } = await supabase
      .from("items")
      .select("id,title,color,location,description,user_id")
      .eq("type", "lost")
      .eq("status", "open")
      .eq("category", category)
      .neq("user_id", userRecord.id)
      .limit(30);

    const likelyMatches = (candidateLostItems ?? [])
      .filter((lostItem) => {
        const itemColor = String(lostItem.color ?? "").toLowerCase();
        const itemLocation = String(lostItem.location ?? "").toLowerCase();
        const itemTitle = String(lostItem.title ?? "").toLowerCase();
        const itemDescription = String(lostItem.description ?? "").toLowerCase();

        const colorMatch = itemColor !== "" && itemColor === normalizedColor;
        const locationMatch = itemLocation !== "" && itemLocation === normalizedLocation;
        const keywordMatch =
          normalizedTitle.includes(itemTitle) ||
          itemTitle.includes(normalizedTitle) ||
          normalizedDescription.includes(itemTitle) ||
          itemDescription.includes(normalizedTitle);

        return colorMatch || locationMatch || keywordMatch;
      })
      .slice(0, 10);

    await Promise.all(
      likelyMatches.map((lostItem) =>
        createNotification({
          userId: String(lostItem.user_id),
          type: "item_match",
          title: "Possible match found for your lost item",
          body: `A found report "${createdFoundItem.title}" may match your lost post. Review it at /items/${createdFoundItem.id}.`,
        }),
      ),
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
