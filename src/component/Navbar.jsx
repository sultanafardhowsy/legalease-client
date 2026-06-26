"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button, Dropdown, Avatar } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";
import GlobalSearch from "./GlobalSearchBar";
import Logo from "./logo";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (!mounted) return null;
  if (pathname?.includes("dashboard")) return null;

  // ── Active route helper ──
  const isActive = (href) => pathname === href;

  // ── Shared link class builder ──
  const navLinkClass = (href) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap
    ${
      isActive(href)
        ? "bg-amber-100 text-amber-700 dark:bg-slate-800 dark:text-amber-400 font-semibold"
        : "text-slate-600 hover:bg-amber-50 hover:text-amber-700 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-white"
    }`;

  // ── Mobile link class builder ──
  const mobileNavLinkClass = (href) =>
    `px-4 py-3 rounded-lg text-base font-medium transition-colors
    ${
      isActive(href)
        ? "bg-amber-100 text-amber-700 dark:bg-slate-800 dark:text-amber-400 font-semibold"
        : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
    }`;

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
  };

  const getDashboardLink = () => {
    if (!session?.user?.role) return "/dashboard/client";
    const role = session.user.role.toLowerCase();
    switch (role) {
      case "admin": return "/dashboard/admin";
      case "lawyer": return "/dashboard/lawyer";
      default: return "/dashboard/client";
    }
  };

  const getUserInitials = () => {
    if (!session?.user?.name) return "U";
    const names = session.user.name.split(" ");
    return names.length > 1
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : names[0][0].toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/70 border-b border-slate-200 shadow-sm dark:bg-[#0f172a]/80 dark:border-slate-800 transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">

        {/* ── LEFT: Logo & Mobile Toggle ── */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            className="md:hidden p-2 text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          <Logo />
        </div>

        {/* ── MIDDLE: Desktop Nav Links ── */}
        <div className="hidden md:flex items-center gap-2 lg:gap-6 flex-1 justify-center">
          <Link href="/" className={navLinkClass("/")}>
            Home
          </Link>

          <Link href="/lawyers" className={navLinkClass("/lawyers")}>
            Browse Lawyers
          </Link>

          {session && (
            <Link
              href={getDashboardLink()}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap
                ${pathname?.includes("dashboard")
                  ? "bg-amber-100 text-amber-700 dark:bg-slate-800 dark:text-amber-400 font-semibold"
                  : "text-slate-600 hover:bg-amber-50 hover:text-amber-700 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-white"
                }`}
            >
              Dashboard
            </Link>
          )}

          <div className="ml-2 lg:ml-4 w-full max-w-xs">
            <GlobalSearch theme={theme} />
          </div>
        </div>

        {/* ── RIGHT: Auth + Theme ── */}
        <div className="flex items-center gap-3 lg:gap-4 shrink-0">
          {!isPending && (
            <>
              {session ? (
                <Dropdown>
                  <Dropdown.Trigger>
                    <div className="flex items-center justify-center rounded-full border border-amber-400 dark:border-amber-600 transition-transform outline-none cursor-pointer hover:ring-2 hover:ring-amber-500/50 hover:scale-105 duration-200">
                      <Avatar.Root className="w-8 h-8 lg:w-9 lg:h-9 text-xs bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-500 font-bold overflow-hidden rounded-full">
                        {session.user.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <Avatar.Image
                            src={session.user.image}
                            alt="User Avatar"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                        <Avatar.Fallback className="flex items-center justify-center w-full h-full">
                          {getUserInitials()}
                        </Avatar.Fallback>
                      </Avatar.Root>
                    </div>
                  </Dropdown.Trigger>

                  <Dropdown.Popover
                    className="bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl min-w-[220px]"
                    placement="bottom end"
                  >
                    <Dropdown.Menu aria-label="Profile Actions" className="p-2">
                      <Dropdown.Item
                        textValue="User Info"
                        className="h-14 gap-2 mb-2 border-b border-slate-100 dark:border-slate-800 cursor-default rounded-none pointer-events-none"
                      >
                        <p className="font-medium text-slate-500 dark:text-slate-400 text-xs">Signed in as</p>
                        <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{session.user.name}</p>
                      </Dropdown.Item>
                      <Dropdown.Item
                        textValue="Dashboard"
                        className="text-slate-700 font-medium py-2 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        onPress={() => router.push(getDashboardLink())}
                      >
                        My Dashboard
                      </Dropdown.Item>
                      <Dropdown.Item
                        textValue="Profile"
                        className="text-slate-700 font-medium py-2 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        onPress={() => router.push("/profile")}
                      >
                        Profile
                      </Dropdown.Item>
                      <Dropdown.Item
                        textValue="Sign Out"
                        className="text-red-600 dark:text-red-400 font-semibold py-2 mt-1 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        onPress={handleSignOut}
                      >
                        Sign Out
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    href="/login"
                    className="rounded-md px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-all duration-200"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-md px-4 py-2 text-sm font-semibold bg-amber-500 text-white hover:bg-amber-600 shadow-sm transition-all duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </>
          )}

          <Button
            isIconOnly
            variant="flat"
            size="sm"
            aria-label="Toggle theme"
            className="bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-all duration-200 rounded-full w-9 h-9"
            onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </Button>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-lg px-4 py-6 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
          <div className="w-full mb-2">
            <GlobalSearch theme={theme} />
          </div>

          <Link href="/" className={mobileNavLinkClass("/")}>
            Home
          </Link>

          <Link href="/lawyers" className={mobileNavLinkClass("/lawyers")}>
            Browse Lawyers
          </Link>

          {session && (
            <Link
              href={getDashboardLink()}
              className={`px-4 py-3 rounded-lg text-base font-medium transition-colors
                ${pathname?.includes("dashboard")
                  ? "bg-amber-100 text-amber-700 dark:bg-slate-800 dark:text-amber-400 font-semibold"
                  : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                }`}
            >
              Dashboard
            </Link>
          )}

          {!session && (
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/login"
                className="w-full text-center rounded-lg px-4 py-3 text-base font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 dark:text-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="w-full text-center rounded-lg px-4 py-3 text-base font-medium text-white bg-amber-500 hover:bg-amber-600 transition-colors shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}