"use client";

import Link from "next/link";
import { useEffect, Suspense } from "react";
import { addToast } from "@heroui/toast";
import { useSearchParams } from "next/navigation";

function UnauthorizedInner() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("error") === "access_denied") {
      setTimeout(() => {
        addToast({
          title: "Access Denied",
          description: "You do not have permission to view this page.",
          color: "danger",
        });
      }, 100);
    }
  }, [searchParams]);

  return (
    <div className="relative max-w-md w-full">
      <div className="absolute -top-10 -left-10 h-40 w-40 bg-red-500/20 blur-3xl rounded-full"></div>
      <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-purple-500/20 blur-3xl rounded-full"></div>

      <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl text-center overflow-hidden">
        <div className="mx-auto mb-6 flex items-center justify-center w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20">
          <svg
            className="w-12 h-12 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 10V7a4 4 0 10-8 0v3m-2 0h12a1 1 0 011 1v8a1 1 0 01-1 1H6a1 1 0 01-1-1v-8a1 1 0 011-1z"
            />
          </svg>
        </div>

        <p className="text-red-400 font-semibold tracking-widest uppercase text-sm mb-2">
          Error 401
        </p>

        <h1 className="text-4xl font-bold text-white mb-4">
          Access Denied
        </h1>

        <p className="text-zinc-400 leading-relaxed mb-8">
          Sorry, you don&apos;t have permission to access this page.
          Please sign in with an authorized account or return to the homepage.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/signin"
            className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/20"
          >
            Sign In
          </Link>

          <Link
            href="/"
            className="px-6 py-3 rounded-xl border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-200 font-medium transition-all duration-300 hover:scale-105"
          >
            Go Home
          </Link>
        </div>

        <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>

        <p className="mt-4 text-xs text-zinc-500">
          Need access? Contact your administrator.
        </p>
      </div>
    </div>
  );
}

export default function UnauthorizedContent() {
  return (
    <Suspense fallback={<div className="max-w-md w-full h-96 rounded-3xl bg-white/5 animate-pulse" />}>
      <UnauthorizedInner />
    </Suspense>
  );
}
