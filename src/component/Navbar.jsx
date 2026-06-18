"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/asset/logo.png";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client"; // 🔐 Import your auth client
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // 🔐 BetterAuth reactive session hook
  const { data: session, isPending } = authClient.useSession();

  // Prevent SSR hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔐 Secure Sign Out handler
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login"); // Push to login on successful cleanup
          router.refresh();
        }
      }
    });
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-default-200 bg-background/70 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
        {/* Logo + Brand */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={logo}
            alt="LegalEase"
            width={170}
            height={50}
            className="w-auto h-auto" // Added to prevent Next.js image ratio warnings
            priority
          />
        </Link>

        {/* Navigation Content & Toggles */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="rounded-md px-4 py-2 text-sm font-semibold text-foreground/80 transition hover:bg-default-100 hover:text-foreground"
          >
            Home
          </Link>

          {/* 🔐 Dynamic Auth State Links */}
          {mounted && !isPending && (
            <>
              {session ? (
                // State A: Authenticated Display
                <>
                  <span className="text-sm font-medium text-default-600 hidden sm:inline">
                    Hello, <strong className="text-foreground">{session.user.name}</strong>
                  </span>
                  <Button
                    variant="flat"
                    color="danger"
                    size="sm"
                    className="font-bold font-sans"
                    onPress={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                // State B: Unauthenticated Guest Links
                <>
                  <Link
                    href="/signup"
                    className="rounded-md px-4 py-2 text-sm font-semibold text-foreground/80 transition hover:bg-default-100 hover:text-foreground"
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-md px-4 py-2 text-sm font-semibold text-foreground/80 transition hover:bg-default-100 hover:text-foreground"
                  >
                    Log In
                  </Link>
                </>
              )}
            </>
          )}

          {/* Light / Dark Mode Toggle Button */}
          {mounted && (
            <Button
              isIconOnly
              variant="flat"
              aria-label="Toggle theme"
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