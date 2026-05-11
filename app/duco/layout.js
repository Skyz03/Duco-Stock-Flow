import { AppShell } from "../../components/AppShell";

const ducoNav = [
  { href: "/duco", label: "Dashboard", icon: "LayoutDashboard", exact: true },
  { href: "/duco/purchase", label: "Purchase", icon: "ShoppingCart" },
  { href: "/duco/production", label: "Production", icon: "Factory" },
  { href: "/duco/sales", label: "Sales", icon: "TrendingUp" },
  { href: "/duco/stock", label: "Stock", icon: "Boxes" },
];

export default function DucoLayout({ children }) {
  return (
    <AppShell
      companyName="Duco Cups"
      brandColor="#1D9E75"
      navItems={ducoNav}
      backLink={{ label: "← All Companies", href: "/" }}
    >
      {children}
    </AppShell>
  );
}
