import Link from "next/link";

export const metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col sm:flex-row gap-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-900 mb-4">Duco Cups</h2>
          <Link
            href="/duco"
            className="inline-block rounded-lg px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#1D9E75" }}
          >
            Go to Dashboard
          </Link>
        </div>

        <div className="hidden sm:block w-px bg-zinc-200" />

        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-900 mb-4">Packmandu</h2>
          <Link
            href="/pack"
            className="inline-block rounded-lg px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#185FA5" }}
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
