import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Card } from "@/components/ui/card";

export function Footer() {
  return (
    <footer className="mb-4 mt-10">
      <Card className="px-5 py-6">
        <div className="flex flex-col gap-4 text-sm text-zinc-600 dark:text-zinc-300 md:flex-row md:items-center md:justify-between">
        <p>
          {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
        <nav className="flex flex-wrap gap-3">
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-zinc-900 dark:hover:text-zinc-100">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      </Card>
    </footer>
  );
}
