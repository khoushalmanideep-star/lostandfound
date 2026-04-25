"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileSearch, Handshake, ShieldCheck, Sparkles } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const cleanupFns: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const heroGlow = document.querySelector<HTMLElement>("[data-hero-glow]");
      if (heroGlow) {
        gsap.to(heroGlow, {
          yPercent: 30,
          ease: "none",
          scrollTrigger: {
            trigger: heroGlow,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      const sections = gsap.utils.toArray<HTMLElement>("[data-animate-section]");
      sections.forEach((section, index) => {
        gsap.from(section, {
          y: 36,
          opacity: 0,
          duration: 0.75,
          ease: "power2.out",
          delay: index === 0 ? 0.1 : 0,
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });

      const cards = gsap.utils.toArray<HTMLElement>("[data-animate-card]");
      cards.forEach((card) => {
        gsap.from(card, {
          y: 24,
          opacity: 0,
          duration: 0.55,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      });

      const ctaButtons = gsap.utils.toArray<HTMLElement>("[data-cta-button]");
      ctaButtons.forEach((button) => {
        const onEnter = () => {
          gsap.to(button, {
            y: -3,
            scale: 1.02,
            duration: 0.22,
            ease: "power2.out",
          });
        };
        const onLeave = () => {
          gsap.to(button, {
            y: 0,
            scale: 1,
            duration: 0.22,
            ease: "power2.out",
          });
        };
        const onPress = () => {
          gsap.to(button, {
            scale: 0.98,
            duration: 0.1,
            ease: "power2.out",
          });
        };
        const onRelease = () => {
          gsap.to(button, {
            scale: 1.02,
            duration: 0.12,
            ease: "power2.out",
          });
        };

        button.addEventListener("mouseenter", onEnter);
        button.addEventListener("mouseleave", onLeave);
        button.addEventListener("mousedown", onPress);
        button.addEventListener("mouseup", onRelease);
        button.addEventListener("touchstart", onPress, { passive: true });
        button.addEventListener("touchend", onLeave);

        cleanupFns.push(() => {
          button.removeEventListener("mouseenter", onEnter);
          button.removeEventListener("mouseleave", onLeave);
          button.removeEventListener("mousedown", onPress);
          button.removeEventListener("mouseup", onRelease);
          button.removeEventListener("touchstart", onPress);
          button.removeEventListener("touchend", onLeave);
        });
      });
    }, rootRef);

    return () => {
      cleanupFns.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="flex w-full flex-1">
      <div className="w-full space-y-10">
        <section
          data-animate-section
          className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-12"
        >
          <div
            data-hero-glow
            className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-500/20"
          />
          <div className="relative mx-auto max-w-4xl space-y-6 text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-zinc-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              <Sparkles className="h-3.5 w-3.5" />
              Campus Safety Powered
            </p>
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">{siteConfig.name}</h1>
            <p className="mx-auto max-w-2xl text-base text-zinc-600 dark:text-zinc-300 md:text-lg">
              A modern college portal to report lost items, publish found items, and return belongings to the right owner with verified handover.
            </p>
            <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
              <Link
                href="/items"
                data-cta-button
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                Browse Items
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/lost/new"
                data-cta-button
                className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Report Lost Item
              </Link>
            </div>
          </div>
        </section>

        <section
          data-animate-section
          className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-10"
        >
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">How it works</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "1. Post Report",
                text: "Students report lost items or finders publish found items with details and photos.",
              },
              {
                title: "2. Match & Claim",
                text: "Owners browse and claim likely matches with identifying information for verification.",
              },
              {
                title: "3. Secure Return",
                text: "After validation, handover is completed at security desk or direct exchange.",
              },
            ].map((step) => (
              <article
                key={step.title}
                data-animate-card
                className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-700 dark:bg-zinc-800/60"
              >
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{step.title}</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          data-animate-section
          className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-10"
        >
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Core features</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              {
                icon: FileSearch,
                title: "Smart Browse",
                text: "Search and filter found items quickly by category, type, and location.",
              },
              {
                icon: ShieldCheck,
                title: "Verified Claims",
                text: "Structured claim flow helps confirm ownership before return is approved.",
              },
              {
                icon: Handshake,
                title: "Safe Retrieval",
                text: "Clear return status and handover steps for a safe and transparent process.",
              },
              {
                icon: CheckCircle2,
                title: "Admin Oversight",
                text: "Admin panel supports moderation, dispute handling, and status updates.",
              },
            ].map((feature) => (
              <article
                key={feature.title}
                data-animate-card
                className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-700 dark:bg-zinc-800/60"
              >
                <feature.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                <h3 className="mt-3 text-base font-semibold">{feature.title}</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          data-animate-section
          className="rounded-3xl border border-zinc-200 bg-zinc-900 p-8 text-white shadow-sm dark:border-zinc-700 md:p-10"
        >
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Ready to help someone recover their item?</h2>
            <p className="mt-3 text-zinc-300">
              Join the campus network and keep the lost-and-found process fast, secure, and organized.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                data-cta-button
                className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200"
              >
                Create Account
              </Link>
              <Link
                href="/found/new"
                data-cta-button
                className="rounded-xl border border-zinc-500 px-5 py-3 text-sm font-medium transition hover:bg-zinc-800"
              >
                Report Found Item
              </Link>
            </div>
          </div>
        </section>

        <section
          data-animate-section
          className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-center text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
        >
          Built for students, finders, and admins to make campus item recovery simple.
        </section>
      </div>
    </div>
  );
}
