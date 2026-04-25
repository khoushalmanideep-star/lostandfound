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
    const dateLost = String(formData.get("dateLost") ?? "").trim();
    const image = formData.get("image");

    if (!title || !category || !color || !description || !location || !dateLost) {
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
      const path = `lost/${userId}/${crypto.randomUUID()}.${extension}`;

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

    const { data: createdLostItem, error: insertError } = await supabase
      .from("items")
      .insert({
        type: "lost",
        title,
        category,
        color,
        description,
        location,
        image_url: imageUrl,
        status: "open",
        user_id: userRecord.id,
        date_lost: dateLost,
      })
      .select("id,title,category,color,location,description,user_id")
      .single();

    if (insertError || !createdLostItem) {
      return NextResponse.json({ error: "Failed to create lost item post." }, { status: 500 });
    }

    const normalizedColor = color.toLowerCase();
    const normalizedLocation = location.toLowerCase();
    const normalizedTitle = title.toLowerCase();
    const normalizedDescription = description.toLowerCase();

    const { data: candidateFoundItems } = await supabase
      .from("items")
      .select("id,title,color,location,description,user_id")
      .eq("type", "found")
      .eq("status", "open")
      .eq("category", category)
      .neq("user_id", userRecord.id)
      .limit(30);

    const likelyMatches = (candidateFoundItems ?? [])
      .filter((foundItem) => {
        const itemColor = String(foundItem.color ?? "").toLowerCase();
        const itemLocation = String(foundItem.location ?? "").toLowerCase();
        const itemTitle = String(foundItem.title ?? "").toLowerCase();
        const itemDescription = String(foundItem.description ?? "").toLowerCase();

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
      likelyMatches.map((foundItem) =>
        createNotification({
          userId: String(foundItem.user_id),
          type: "item_match",
          title: "Possible match found for a found item",
          body: `A new lost report "${createdLostItem.title}" may match your found post. Review it at /items/${foundItem.id}.`,
        }),
      ),
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
