import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { ClipboardList, PackageSearch, PlusCircle, Search, ShieldCheck, Shield } from "lucide-react";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { createServiceRoleSupabaseClient } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const displayName =
    typeof sessionClaims?.full_name === "string"
      ? sessionClaims.full_name
      : typeof sessionClaims?.email === "string"
        ? sessionClaims.email
        : "Student";

  const supabase = createServiceRoleSupabaseClient();

  const { data: dbUser } = await supabase.from("users").select("id,role").eq("clerk_id", userId).single();

  const dbUserId = dbUser?.id as string | undefined;
  const userRole = (dbUser?.role as string | undefined) ?? "student";

  let dashboardCounts = {
    lostPosts: 0,
    foundPosts: 0,
    claims: 0,
  };

  const quickActions = [
    {
      href: "/lost/new",
      title: "Report Lost Item",
      description: "Create a post for a missing item.",
      icon: Search,
    },
    {
      href: "/found/new",
      title: "Report Found Item",
      description: "Help someone recover their belonging.",
      icon: PlusCircle,
    },
    {
      href: "/items",
      title: "Browse Listings",
      description: "Find matches using category and location.",
      icon: PackageSearch,
    },
    ...(userRole === "admin"
      ? [
          {
            href: "/admin",
            title: "Open Admin Panel",
            description: "Review claims, users, and reported items.",
            icon: Shield,
          },
        ]
      : []),
  ];

  let recentActivity: string[] = [
    "No recent activity yet.",
    "Your future posts, claims, and returns will appear here.",
  ];

  if (userRole === "admin") {
    const [{ count: openLostCount }, { count: openFoundCount }, { count: pendingClaimsCount }, { data: recentClaims }] =
      await Promise.all([
        supabase.from("items").select("id", { count: "exact", head: true }).eq("type", "lost").eq("status", "active"),
        supabase.from("items").select("id", { count: "exact", head: true }).eq("type", "found").eq("status", "active"),
        supabase.from("claims").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("claims").select("status,created_at,item_id").order("created_at", { ascending: false }).limit(5),
      ]);

    dashboardCounts = {
      lostPosts: openLostCount ?? 0,
      foundPosts: openFoundCount ?? 0,
      claims: pendingClaimsCount ?? 0,
    };

    const merged = (recentClaims ?? []).map(
      (claim) =>
        `Claim ${String(claim.item_id).slice(0, 8)}... is ${String(claim.status)} (${new Date(
          String(claim.created_at),
        ).toLocaleDateString()})`,
    );

    if (merged.length > 0) {
      recentActivity = merged;
    } else {
      recentActivity = ["No claims activity yet.", "Admin activity will appear here as claims are processed."];
    }
  } else if (dbUserId) {
    const [{ count: lostCount }, { count: foundCount }, { count: claimsCount }, { data: recentItems }, { data: recentClaims }] =
      await Promise.all([
        supabase.from("items").select("id", { count: "exact", head: true }).eq("user_id", dbUserId).eq("type", "lost"),
        supabase.from("items").select("id", { count: "exact", head: true }).eq("user_id", dbUserId).eq("type", "found"),
        supabase.from("claims").select("id", { count: "exact", head: true }).eq("claimer_id", dbUserId),
        supabase
          .from("items")
          .select("type,title,status,created_at")
          .eq("user_id", dbUserId)
          .order("created_at", { ascending: false })
          .limit(3),
        supabase
          .from("claims")
          .select("status,created_at,item_id")
          .eq("claimer_id", dbUserId)
          .order("created_at", { ascending: false })
          .limit(3),
      ]);

    dashboardCounts = {
      lostPosts: lostCount ?? 0,
      foundPosts: foundCount ?? 0,
      claims: claimsCount ?? 0,
    };

    const itemActivity = (recentItems ?? []).map((item) => {
      const action = item.type === "lost" ? "reported a lost item" : "reported a found item";
      return {
        date: new Date(String(item.created_at)).getTime(),
        text: `You ${action}: ${String(item.title)} (${String(item.status)})`,
      };
    });

    const claimActivity = (recentClaims ?? []).map((claim) => ({
      date: new Date(String(claim.created_at)).getTime(),
      text: `You submitted/updated a claim (${String(claim.status)}) for item ${String(claim.item_id).slice(0, 8)}...`,
    }));

    const merged = [...itemActivity, ...claimActivity]
      .sort((a, b) => b.date - a.date)
      .slice(0, 5)
      .map((entry) => entry.text);

    if (merged.length > 0) {
      recentActivity = merged;
    }
  }

  return (
    <PageShell
      title="Student Dashboard"
      description="Manage reports, claims, and return status from one place."
    >
      <div className="space-y-6">
        <section className="saas-gradient-border p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Getting started</p>
              <h3 className="mt-1 text-lg font-semibold tracking-tight">What should I do next?</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                Choose the path that matches your situation. You can always open the full guide in Help.
              </p>
            </div>
            <Link
              href="/help"
              className="saas-btn-secondary"
            >
              Open Help
            </Link>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 bg-white/70 p-4 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/40">
              <p className="text-sm font-semibold">I lost an item</p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                Report it, then browse found posts and submit a claim for the best match.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href="/lost/new"
                  className="saas-btn-primary"
                >
                  Report Lost
                </Link>
                <Link
                  href="/items"
                  className="saas-btn-secondary"
                >
                  Browse Items
                </Link>
                <Link
                  href="/claims"
                  className="saas-btn-secondary"
                >
                  My Claims
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white/70 p-4 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/40">
              <p className="text-sm font-semibold">I found an item</p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                Post it, then review incoming claims and approve/reject with proof.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href="/found/new"
                  className="saas-btn-primary"
                >
                  Report Found
                </Link>
                <Link
                  href="/claims"
                  className="saas-btn-secondary"
                >
                  Incoming Claims
                </Link>
                <Link
                  href="/notifications"
                  className="saas-btn-secondary"
                >
                  Notifications
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="saas-stat">
          <p className="text-sm text-zinc-600 dark:text-zinc-300">Welcome back</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">{displayName}</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Keep your campus lost-and-found activity organized from this dashboard.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="info">{userRole === "admin" ? "Admin mode" : "Student mode"}</Badge>
            <Badge>Secure by Clerk</Badge>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article className="saas-stat">
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              {userRole === "admin" ? "Open Lost Posts" : "My Lost Posts"}
            </p>
            <p className="mt-2 text-3xl font-semibold">{dashboardCounts.lostPosts}</p>
          </article>
          <article className="saas-stat">
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              {userRole === "admin" ? "Open Found Posts" : "My Found Posts"}
            </p>
            <p className="mt-2 text-3xl font-semibold">{dashboardCounts.foundPosts}</p>
          </article>
          <article className="saas-stat">
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              {userRole === "admin" ? "Pending Claims" : "Claims"}
            </p>
            <p className="mt-2 text-3xl font-semibold">{dashboardCounts.claims}</p>
          </article>
        </section>

        {userRole === "admin" ? (
          <section className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 dark:border-indigo-700 dark:bg-indigo-900/20">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Administrator Access</p>
                <p className="mt-1 text-sm text-indigo-700/80 dark:text-indigo-300/90">
                  You are signed in as admin. Open moderation tools to manage claims and posts.
                </p>
              </div>
              <Link href="/admin" className="saas-btn-primary">
                Go to Admin Panel
              </Link>
            </div>
          </section>
        ) : null}

        <section>
          <h3 className="mb-3 text-lg font-semibold tracking-tight">Quick Actions</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href} className="saas-stat">
                <action.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                <h4 className="mt-3 text-base font-semibold">{action.title}</h4>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{action.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="saas-stat">
          <div className="mb-3 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
            <h3 className="text-lg font-semibold tracking-tight">Recent Activity</h3>
          </div>
          <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
            {recentActivity.map((item) => (
              <li key={item} className="rounded-xl border border-zinc-200 bg-white/60 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900/40">
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            Your account is authenticated and protected by Clerk.
          </div>
        </section>
      </div>
    </PageShell>
  );
}
