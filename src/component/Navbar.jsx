"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/asset/logo.png";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent SSR hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-default-200 bg-background/70 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
        {/* Logo + Brand */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={logo}
            alt="LegalEase"
            width={100}
            height={70}
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