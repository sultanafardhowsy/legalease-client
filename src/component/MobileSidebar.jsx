"use client";

import { useState } from "react";

export default function MobileSidebar({ navContent }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden"
      >
        ☰
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setOpen(false)}
          />

          <aside className="fixed left-0 top-0 h-screen w-64 bg-white z-50">
            {navContent}
          </aside>
        </>
      )}
    </>
  );
}