import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-white dark:bg-zinc-900 px-4 text-center">
      <div className="max-w-md">
        <h1 className="text-7xl font-extrabold text-zinc-800 dark:text-zinc-100">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-zinc-700 dark:text-zinc-300">
          Page not found
        </h2>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Sorry, we couldn’t find the page you were looking for.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-4 py-2 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
