import { AppShell } from "../../components/AppShell";

const packNav = [
  { href: "/pack", label: "Dashboard" },
  { href: "/pack/entries", label: "Entries" },
  { href: "/pack/stock", label: "Stock Overview" },
];

export default function PackLayout({ children }) {
  return (
    <AppShell
      title="Packmandu"
      subtitle="Packaging inventory management"
      accentColor="#185FA5"
      navItems={packNav}
    >
      {children}
    </AppShell>
  );
}
