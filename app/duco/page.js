import { DucoDashboardClient } from "../../components/DucoDashboardClient";

export const metadata = {
  title: "Dashboard — Duco Cups",
  description: "Overview of Duco Cups inventory: purchases, production, sales, and net stock.",
};

export default function DucoDashboardPage() {
  return <DucoDashboardClient />;
}
