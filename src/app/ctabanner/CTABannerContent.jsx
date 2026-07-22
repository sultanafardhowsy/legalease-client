"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTABannerContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl p-10 md:p-16 text-center border transition-colors duration-500 bg-slate-100 dark:bg-slate-900/50 border-amber-500/20 shadow-2xl"
    >
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full pointer-events-none bg-amber-500/10 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full pointer-events-none bg-indigo-500/10 blur-3xl" />

      <div className="relative z-10">
        <span className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full border bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400">
          Are You a Lawyer?
        </span>

        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Grow Your Legal Practice
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
            with LegalEase
          </span>
        </h2>

        <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base max-w-lg mx-auto mb-8 leading-relaxed">
          Join 500+ verified lawyers on our platform. Reach thousands of clients, 
          manage your bookings, and grow your practice — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold text-white text-sm transition-all hover:scale-105 hover:shadow-lg hover:shadow-amber-500/30 bg-gradient-to-r from-amber-500 to-orange-600"
          >
            Join as a Lawyer →
          </Link>
          
          <Link
            href="/lawyers"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-slate-900 dark:text-white text-sm transition-all hover:scale-105 bg-slate-200/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 hover:bg-slate-300/50 dark:hover:bg-white/10"
          >
            Browse Lawyers
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-slate-500 dark:text-slate-500 text-xs font-medium">
          {['✅ No hidden fees', '🔒 Verified profiles', '⚡ Instant hiring', '📞 24/7 support'].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
