import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-50 px-4 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">404</p>
      <h1 className="text-4xl font-semibold text-zinc-900">Page not found</h1>
      <p className="max-w-sm text-zinc-600">
        The page you&#39;re looking for doesn&#39;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
      >
        Back to home
      </Link>
    </div>
  );
}
