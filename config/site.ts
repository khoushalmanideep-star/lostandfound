export const siteConfig = {
  name: "Lost & Found Portal",
  description:
    "College-only portal to report, browse, claim, and safely return lost and found items.",
  nav: [
    { href: "/", label: "Home" },
    { href: "/items", label: "Browse Items" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/claims", label: "My Claims" },
    { href: "/lost/new", label: "Report Lost" },
    { href: "/found/new", label: "Report Found" },
    { href: "/help", label: "Help" },
  ],
} as const;
