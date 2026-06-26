'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Footer({ onContactClick }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname(); // Hook to trace the route path

  // Newsletter states
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Prevent server-side rendering mismatch issues
  if (!mounted) return null;

  // 2. Conditional rendering: If the path contains "dashboard", don't render the footer
  if (pathname && pathname.includes("dashboard")) {
    return null;
  }

  // Frontend-only newsletter handler
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      console.log('Newsletter subscription submitted for:', email);
      setSubscribed(true);
      setEmail(''); // Clear input
      
      // Reset the success message after 4 seconds
      setTimeout(() => {
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <footer 
      // style={{ background: 'rgb(var(--background-start-rgb))' }}
      className="py-16 px-6 border-t bg-amber-50 border-slate-100 dark:border-white/5 transition-colors duration-500" 
      id="contact-footer"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
          {/* Left: About */}
          <div className="space-y-4">
             <h2 className="text-3xl font-bold">
                Legal<span className="text-warning">Ease</span>
             </h2>
             <p 
              style={{ color: 'rgb(var(--foreground-rgb))', opacity: 0.7 }}
              className="text-sm leading-relaxed max-w-xs">
              Simplifying legal services by connecting users with trusted legal
              resources, lawyers, and legal information in one secure platform.
             </p>
          </div>

          {/* Center: Quick Links */}
          <div className="space-y-4">
            <h4 
              style={{ color: 'rgb(var(--foreground-rgb))' }}
              className="text-lg font-semibold"
            >
              Quick Links
            </h4>
            <ul 
              style={{ color: 'rgb(var(--foreground-rgb))', opacity: 0.8 }}
              className="space-y-2 text-sm"
            >
              <li><a className="hover:text-slate-900 dark:hover:text-white transition-colors" href="/show-alldata">All Ideas</a></li>
              <li><a className="hover:text-slate-900 dark:hover:text-white transition-colors" href="/add-idea">Add Idea</a></li>
              <li><a className="hover:text-slate-900 dark:hover:text-white transition-colors" href="/my-idea">My Idea</a></li>
              <li>
                <button 
                  onClick={onContactClick}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors text-left"
                >
                  Contact: 01712345678
                </button>
              </li>
            </ul>
          </div>

          {/* Right: Connect & Newsletter */}
          <div className="space-y-6">
            <div>
              <h4 
                style={{ color: 'rgb(var(--foreground-rgb))' }}
                className="text-lg font-semibold mb-4"
              >
                Connect With Me
              </h4>
              <div className="flex items-center gap-6">
                <a 
                  aria-label="GitHub" 
                  style={{ color: 'rgb(var(--foreground-rgb))' }}
                  className="opacity-70 hover:opacity-100 transition-opacity" 
                  href="https://github.com/sultanafardhowsy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.414-4.041-1.414-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
                </a>
                <a 
                  aria-label="LinkedIn" 
                  style={{ color: 'rgb(var(--foreground-rgb))' }}
                  className="opacity-70 hover:opacity-100 transition-opacity" 
                  href="https://www.linkedin.com/in/sultanafardhowsytamanna" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
                </a>
                <a 
                  aria-label="Email" 
                  style={{ color: 'rgb(var(--foreground-rgb))' }}
                  className="opacity-70 hover:opacity-100 transition-opacity" 
                  href="mailto:sfardhowsy@gmail.com"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </a>
              </div>
            </div>

            {/* Newsletter Signup Form Placeholder */}
            <div className="space-y-2 pt-2 border-t border-black/5 dark:border-white/5 md:border-t-0 md:pt-0">
              <h4 
                style={{ color: 'rgb(var(--foreground-rgb))' }}
                className="text-sm font-semibold"
              >
                Newsletter Signup
              </h4>
              {!subscribed ? (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-warning/50 flex-grow"
                  />
                  <button
                    type="submit"
                    className="text-xs px-4 py-2 bg-warning hover:bg-warning/90 text-white font-medium rounded transition-colors"
                  >
                    Join
                  </button>
                </form>
              ) : (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium py-2 animate-pulse">
                  Thank you for subscribing!
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="border-t border-divider mt-10 pt-6 text-center text-sm text-default-400">
            © {new Date().getFullYear()} LegalEase. All Rights Reserved.
           </div>
          <p className="text-slate-500 dark:text-slate-600 text-xs">Built with passion & Next.js/Tailwind</p>
        </div>
      </div>
    </footer>
  );
}