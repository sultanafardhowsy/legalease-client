"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import GlobalSearch from "../GlobalSearchBar";


export default function DashboardNavbar() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const getUserInitials = () => {
    if (!session?.user?.name) return "U";
    return session.user.name.slice(0, 2).toUpperCase();
  };
 const getSearchBasePath = () => {
  const role = session?.user?.role?.toLowerCase();
  switch (role) {
    case "admin": return "/dashboard/admin/lawyers";
    case "lawyer": return "/dashboard/lawyer/lawyers";
    default: return "/dashboard/client/lawyers";
  }
};

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-default-200 bg-background/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 w-full items-center justify-between px-6 gap-4">

        {/* ── LEFT: Homepage link ── */}
        <div className="flex shrink-0">
          <Link
            href="/"
            className="group flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-default-600 transition hover:bg-default-100 hover:text-foreground whitespace-nowrap"
          >
            <span>🏠</span>
            <span className="hidden sm:inline">Homepage</span>
          </Link>
        </div>

        {/* ── MIDDLE: Global Search ── */}
        <div className="flex flex-1 justify-center max-w-sm mx-auto">
          {mounted && (
            <GlobalSearch theme="light" basePath={getSearchBasePath()} />
          )}
        </div>

        {/* ── RIGHT: User Info + Sign Out ── */}
        <div className="flex shrink-0 items-center gap-3">
          {mounted && !isPending && session?.user && (
            <>
              <div className="flex items-center gap-2">
                <div className="relative flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-xs font-bold text-primary overflow-hidden">
                  {session.user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
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

              <Button
                variant="light"
                color="danger"
                size="sm"
                className="font-semibold"
                onPress={handleSignOut}
              >
                Sign Out
              </Button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}
