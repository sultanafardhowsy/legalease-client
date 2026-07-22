"use client";

import UpdateUserModal from "@/component/UpdateUserModal";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

export default function ProfileContent() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex justify-center">
        <p className="text-lg font-semibold text-red-500">
          Please log in first.
        </p>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl dark:bg-slate-900/80 dark:border-blue-500/30 dark:shadow-[0_0_50px_rgba(59,130,246,0.2)] transition-all duration-300">
      <div className="flex flex-col items-center text-center">
        <div className="avatar mb-6">
          <div className="w-28 h-28 rounded-full ring-4 ring-white/30 dark:ring-blue-500/40 ring-offset-4 ring-offset-blue-600 dark:ring-offset-slate-900 overflow-hidden shadow-lg">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                width={112}
                height={112}
                className="rounded-full object-cover w-full h-full"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-white/20 text-white text-4xl font-bold backdrop-blur-sm">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
          {user.name || "Unknown User"}
        </h2>

        <p className="text-white/80 dark:text-blue-200/70 text-sm font-medium mb-8 bg-white/10 dark:bg-blue-950/30 px-3 py-1.5 rounded-full border border-white/10 dark:border-blue-500/10">
          {user.email || "No email available"}
        </p>

        <div className="w-full">
          <UpdateUserModal />
        </div>
      </div>
    </div>
  );
}
