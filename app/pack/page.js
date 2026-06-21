import { PackDashboardClient } from "../../components/PackDashboardClient";

export const metadata = {
  title: "Dashboard — Packmandu",
  description: "Overview of Packmandu packaging inventory: purchases, sales, damage, and net stock.",
};

export default function PackDashboardPage() {
  return <PackDashboardClient />;
}
