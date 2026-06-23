"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/asset/logo.png";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button, Dropdown, Avatar } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";
import GlobalSearch from "./GlobalSearchBar";


export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (pathname.includes("dashboard")) return null;

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
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md shadow-md bg-amber-50 text-slate-900 border-b border-amber-200 dark:bg-[#0f172a] dark:text-slate-100 dark:border-slate-800 transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 gap-4">

        {/* ── LEFT: Logo ── */}
        <div className="flex shrink-0">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={logo}
              alt="LegalEase"
              width={120}
              height={40}
              className="w-auto h-auto dark:brightness-0 dark:invert transition-all duration-200"
              priority
            />
          </Link>
        </div>

        {/* ── MIDDLE: Nav Links + Global Search ── */}
        <div className="hidden md:flex items-center gap-4 flex-1 justify-center">
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-amber-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white transition-all duration-200 whitespace-nowrap"
          >
            Home
          </Link>
          <Link
            href="/lawyers"
            className="rounded-md px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-amber-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white transition-all duration-200 whitespace-nowrap"
          >
            Browse Lawyers
          </Link>
          {mounted && session && (
            <Link
              href={getDashboardLink()}
              className="rounded-md px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-amber-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white transition-all duration-200 whitespace-nowrap"
            >
              Dashboard
            </Link>
          )}

          {/* 🔍 Global Search — sits right after nav links */}
          <GlobalSearch theme={theme} />
        </div>

        {/* ── RIGHT: Auth + Theme ── */}
        <div className="flex items-center gap-4 shrink-0">
          {mounted && !isPending && (
            <>
              {session ? (
                <Dropdown>
                  <Dropdown.Trigger>
                    <div className="flex items-center justify-center rounded-full border-2 border-amber-500 transition-transform outline-none cursor-pointer hover:scale-105 duration-200">
                      <Avatar.Root className="w-8 h-8 text-xs bg-slate-200 dark:bg-neutral-800 text-amber-600 dark:text-amber-500 font-bold overflow-hidden rounded-full">
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
                    className="bg-white text-slate-800 dark:bg-neutral-900 dark:text-neutral-100 border border-slate-200 dark:border-neutral-800 rounded-lg shadow-xl min-w-[200px]"
                    placement="bottom end"
                  >
                    <Dropdown.Menu aria-label="Profile Actions">
                      <Dropdown.Item textValue="User Info" className="h-14 gap-2 border-b border-slate-100 dark:border-neutral-800 cursor-default">
                        <p className="font-semibold text-slate-500 dark:text-neutral-400 text-xs">Signed in as</p>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">{session.user.name}</p>
                      </Dropdown.Item>
                      <Dropdown.Item
                        textValue="Dashboard"
                        className="text-slate-700 hover:bg-slate-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                        onAction={() => router.push(getDashboardLink())}
                      >
                        My Dashboard
                      </Dropdown.Item>
                      <Dropdown.Item
                        textValue="Profile"
                        className="text-slate-700 hover:bg-slate-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                        onAction={() => router.push("/profile")}
                      >
                        Profile
                      </Dropdown.Item>
                      <Dropdown.Item
                        textValue="Sign Out"
                        className="text-red-600 dark:text-danger-500 font-semibold hover:bg-red-50 dark:hover:bg-red-950/30"
                        onAction={handleSignOut}
                      >
                        Sign Out
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="rounded-md px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-amber-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-all duration-200"
                  >
                    Log In
                  </Link>
                  <Button
                    as={Link}
                    href="/signup"
                    size="sm"
                    className="font-bold bg-slate-900 text-white hover:bg-slate-800 dark:bg-amber-500 dark:text-slate-900 dark:hover:bg-amber-400 transition-all duration-200"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </>
          )}

          {mounted && (
            <Button
              isIconOnly
              variant="flat"
              size="sm"
              aria-label="Toggle theme"
              className="bg-amber-100 text-slate-800 hover:bg-amber-200 dark:bg-neutral-800 dark:text-slate-200 dark:hover:bg-neutral-700 transition-all duration-200"
              onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </Button>
          )}
        </div>

      </div>
    </nav>
  );
}
