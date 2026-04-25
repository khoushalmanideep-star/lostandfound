"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

type AppShellProps = {
  children: ReactNode;
};

const AUTH_PATHS = new Set(["/sign-in", "/sign-up"]);

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.has(pathname);

  return (
    <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
      {!isAuthPage ? <Navbar /> : null}
      <main className={`flex flex-1 py-8 ${isAuthPage ? "items-center justify-center" : ""}`}>
        {children}
      </main>
      {!isAuthPage ? <Footer /> : null}
    </div>
  );
}
