"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Lawyers", href: "/lawyers" },
  { label: "Login", href: "/login" },
  { label: "Sign Up", href: "/signup" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Refund Policy", href: "/refund" },
  { label: "Cookie Policy", href: "/cookies" },
];

export default function Footer({ onContactClick }) {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (!mounted) return null;
  if (pathname?.includes("dashboard")) return null;

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="border-t border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-amber-50/60 dark:border-white/10 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/70 sm:p-8 lg:p-10">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
              LegalEase
            </div>
            <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Find the right lawyer, faster.
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Bangladesh&apos;s premier legal marketplace — connecting clients with 500+ verified
              lawyers across every practice area.
            </p>
            <div className="mt-4 space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <p>📧 support@legalease.com.bd</p>
              <p>📍 Dhaka, Bangladesh</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 dark:text-white">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-amber-500 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 dark:text-white">
              Legal
            </h4>
            <ul className="mt-4 space-y-2">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-amber-500 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                 
                   href="/contact"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-amber-500 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-amber-500 transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 dark:text-white">
              Stay Updated
            </h4>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              Get legal tips and platform updates in your inbox.
            </p>

            {!subscribed ? (
              <form onSubmit={handleNewsletterSubmit} className="mt-4 space-y-2">
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-amber-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  required
                />
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-amber-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-600"
                >
                  Subscribe →
                </button>
              </form>
            ) : (
              <p className="mt-4 text-sm text-emerald-500 font-medium">
                ✅ Thank you for subscribing!
              </p>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400 md:flex-row">
          <p>© {new Date().getFullYear()} LegalEase. All Rights Reserved.</p>
          <p>Built with ❤️ using Next.js</p>
        </div>
        </div>
      </div>
    </footer>
  );
}
