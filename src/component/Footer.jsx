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
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Cookie Policy", href: "#" },
];

export default function Footer({ onContactClick }) {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  if (pathname?.includes("dashboard")) return null;

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0f0c29] transition-colors duration-500">
      <div className="max-w-screen-xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-5">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Legal<span className="text-amber-500">Ease</span>
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Bangladesh&apos;s premier legal marketplace — connecting clients with 500+ verified
              lawyers across every practice area.
            </p>
          </div>

          {/* Links Columns */}
          {[
            { title: "Quick Links", links: quickLinks, isButton: false },
            { title: "Legal", links: legalLinks, isButton: true },
          ].map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-slate-600 dark:text-slate-400 hover:text-amber-500 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
                {section.isButton && (
                  <li>
                    <button onClick={onContactClick} className="text-sm text-slate-600 dark:text-slate-400 hover:text-amber-500 transition-colors">
                      Contact Us
                    </button>
                  </li>
                )}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">
              Stay Updated
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Get legal tips and platform updates in your inbox.
            </p>
            {!subscribed ? (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 text-sm rounded-xl border bg-white dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:border-amber-500 transition-colors"
                  required
                />
                <button type="submit" className="px-4 py-2 text-sm font-bold rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-colors">
                  Subscribe →
                </button>
              </form>
            ) : (
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                ✅ Thank you for subscribing!
              </p>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs border-t border-slate-200 dark:border-white/10 text-slate-500">
          <span>© {new Date().getFullYear()} LegalEase. All Rights Reserved.</span>
          <span>Built with ❤️ using Next.js</span>
        </div>
      </div>
    </footer>
  );
}