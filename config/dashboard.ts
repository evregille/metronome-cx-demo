import { SidebarNavItem } from "types";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "MENU",
    items: [
      { href: "/dashboard", icon: "dashboard", title: "Dashboard" },
      { href: "/dashboard/balance", icon: "billing", title: "Balance" },
      {
        href: "/dashboard/usage",
        icon: "package",
        title: "Usage",
      },
      { href: "/dashboard/costs", icon: "lineChart", title: "Costs" },
      {
        href: "/dashboard/admin",
        icon: "laptop",
        title: "Admin Panel",
      },
    ],
  },
  {
    title: "OPTIONS",
    items: [
      {
        href: "/dashboard/settings",
        icon: "settings",
        title: "Settings",
        disabled: true,
      },
      { href: "/", icon: "home", title: "Homepage" },
      { href: "/#", icon: "bookOpen", title: "Documentation", disabled: true },
      { href: "#", icon: "messages", title: "Support", disabled: true },
    ],
  },
];
