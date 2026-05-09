import { AppShell } from "../../components/AppShell";

const ducoNav = [
  { href: "/duco", label: "Dashboard" },
  { href: "/duco/purchase", label: "Purchase" },
  { href: "/duco/production", label: "Production" },
  { href: "/duco/sales", label: "Sales" },
  { href: "/duco/stock", label: "Stock Overview" },
];

export default function DucoLayout({ children }) {
  return (
    <AppShell
      title="Duco Cups"
      subtitle="Cup manufacturing inventory"
      accentColor="#1D9E75"
      navItems={ducoNav}
    >
      {children}
    </AppShell>
  );
}
