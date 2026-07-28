import { AppShell } from "../../components/AppShell";
import { THEME } from "../../lib/theme";

const packNav = [
  { href: "/pack", label: "Dashboard", icon: "LayoutDashboard", exact: true },
  { href: "/pack/registration", label: "Products", icon: "ClipboardList" },
  { href: "/pack/purchase", label: "Purchase", icon: "ShoppingCart" },
  { href: "/pack/sales", label: "Sales", icon: "TrendingUp" },
  { href: "/pack/damage", label: "Damage", icon: "PackageX" },
  { href: "/pack/stock", label: "Stock", icon: "Boxes" },
];

export default function PackLayout({ children }) {
  return (
    <AppShell
      companyName="Packmandu"
      brandColor={THEME.pack.primary}
      navItems={packNav}
      backLink={{ label: "← All Companies", href: "/" }}
    >
      {children}
    </AppShell>
  );
}
