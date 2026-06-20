"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client"; // 🔐 Import your auth client
import { useRouter } from "next/navigation";

export default function DashboardNavbar() {
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
          router.push("/login");
          router.refresh();
        }
      }
    });
  };

  // Extract initials for fallback
  const getUserInitials = () => {
    if (!session?.user?.name) return "U";
    return session.user.name.slice(0, 2).toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-default-200 bg-background/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 w-full items-center justify-between px-6">
        
        {/* Left Side: Empty (Logo and Role Identity removed) */}
        <div className="flex-1 lg:flex-none" />

        {/* Center: Quick Link back to Main Homepage */}
        <div className="flex flex-1 justify-center items-center">
          <Link
            href="/"
            className="group flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium text-default-600 transition hover:bg-default-100 hover:text-foreground"
          >
            <span>🏠</span>
            <span>Go to Main Homepage</span>
          </Link>
        </div>

        {/* Right Side: User Profile Context + Signout */}
        <div className="flex flex-1 lg:flex-none justify-end items-center gap-4">
          
          {/* User Profile Info & Sign Out */}
          {mounted && !isPending && session?.user && (
            <div className="flex items-center gap-3">
              
              {/* User Identity Details */}
              <div className="flex items-center gap-2">
                
                {/* Fixed Clean DOM Custom Avatar */}
                <div className="relative flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-xs font-bold text-primary overflow-hidden">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User Avatar"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{getUserInitials()}</span>
                  )}
                </div>

                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-sm font-semibold text-foreground leading-none">
                    {session.user.name}
                  </span>
                  <span className="text-xs text-default-400 capitalize">
                    {session.user.role || "client"}
                  </span>
                </div>
              </div>

              {/* Quick Sign Out Action */}
              <Button
                variant="light"
                color="danger"
                size="sm"
                className="font-semibold ml-2"
                onPress={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}