import { AppShell } from "../../components/AppShell";

const packNav = [
  { href: "/pack", label: "Dashboard", icon: "LayoutDashboard", exact: true },
  { href: "/pack/entries", label: "Inventory", icon: "ClipboardList" },
  { href: "/pack/stock", label: "Stock", icon: "Boxes" },
];

export default function PackLayout({ children }) {
  return (
    <AppShell
      companyName="Packmandu"
      brandColor="#185FA5"
      navItems={packNav}
      backLink={{ label: "← All Companies", href: "/" }}
    >
      {children}
    </AppShell>
  );
}
