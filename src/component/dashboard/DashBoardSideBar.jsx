"use client";

import { useState } from "react";
import Link from "next/link";

import {
  LayoutSideContentLeft,
  Magnifier,
  Person,
  Briefcase,
} from "@gravity-ui/icons";

import {
  Bookmark,
  CreditCard,
  LayoutDashboard,
  Users,
} from "lucide-react";
import Logo from "../logo";

export default function DashBoardSideBar({ user }) {
  const [open, setOpen] = useState(false);

  const client = [
    {
      icon: LayoutDashboard,
      href: "/dashboard/client",
      label: "Dashboard",
    },
    {
      icon: Bookmark,
      href: "/dashboard/client/hiring-history",
      label: "Hiring History",
    },
    {
      icon: Person,
      href: "/dashboard/client/profile",
      label: "Profile",
    },
    {
      icon: Users,
      href: "/dashboard/client/comments",
      label: "My Reviews",
    },
  ];

  const lawyer = [
    {
      icon: LayoutDashboard,
      href: "/dashboard/lawyer",
      label: "Dashboard",
    },
    {
      icon: Magnifier,
      href: "/dashboard/lawyer/hiringhistory",
      label: "Hiring History",
    },
    {
      icon: Person,
      href: "/dashboard/lawyer/manage-legal-profile",
      label: "Profile",
    },
  ];

  const admin = [
    {
      icon: LayoutDashboard,
      href: "/dashboard/admin",
      label: "Dashboard",
    },
    {
      icon: Users,
      href: "/dashboard/admin/users",
      label: "Users",
    },
    {
      icon: CreditCard,
      href: "/dashboard/admin/all-transaction",
      label: "Transactions",
    },
    {
      icon: Briefcase,
      href: "/dashboard/admin/analytics",
      label: "Analytics",
    },
  ];

  const role = user?.role?.toLowerCase?.() || "client";

  const navItems =
    {
      client,
      lawyer,
      admin,
    }[role] || client;

  const renderLinks = () => (
    <nav className="flex flex-col gap-2">
      {/* ── MOBILE-ONLY HOMEPAGE NAVIGATION ── */}
      <Link
        href="/"
        onClick={() => setOpen(false)}
        className="flex md:hidden items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 transition mb-2 border-b border-gray-100 dark:border-gray-800"
      >
        <span>🏠</span>
        <span>Homepage</span>
      </Link>

      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 transition"
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-5">
        <div className="mb-8">
          <Logo />
        </div>

        {renderLinks()}
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => {
          console.log("Opening sidebar");
          setOpen(true);
        }}
        className="fixed left-4 top-4 z-[60] rounded-md border bg-white p-2 shadow md:hidden"
      >
        <LayoutSideContentLeft className="h-5 w-5" />
      </button>

      {/* Mobile Drawer */}
      {open && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <aside className="fixed left-0 top-0 z-50 h-screen w-64 overflow-y-auto border-r border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-black md:hidden">
            <div className="mb-8 flex items-center justify-between">
              <Logo />
              <button
                onClick={() => setOpen(false)}
                className="text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {renderLinks()}
          </aside>
        </>
      )}
    </>
  );
}