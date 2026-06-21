import { AppShell } from "../../components/AppShell";
import { THEME } from "../../lib/theme";

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
      brandColor={THEME.duco.primary}
      navItems={ducoNav}
      backLink={{ label: "← All Companies", href: "/" }}
    >
      {children}
    </AppShell>
  );
}
