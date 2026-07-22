import FeaturedLawyersGrid from "./FeaturedLawyersGrid";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FeaturedLawyers() {
  return (
    <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-500">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4 animate-[fadeSlideDown_0.7s_easeOut]">
          <div>
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-amber-500 dark:text-amber-400 mb-2">
              Handpicked for You
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Featured Lawyers
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-lg">
              Browse our newest verified legal professionals ready to take your case.
            </p>
          </div>
          <Link
            href="/lawyers"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:underline shrink-0"
          >
            View all lawyers <ArrowRight size={16} />
          </Link>
        </div>

        <FeaturedLawyersGrid />
      </div>
    </section>
  );
}
