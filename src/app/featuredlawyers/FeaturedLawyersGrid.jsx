"use client";

import { useEffect, useState } from "react";
import { Button, Chip, Skeleton } from "@heroui/react";
import { Banknote } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/core/api";
import { LawyerDetailModal } from "@/component/LawyerDetailModal";

export default function FeaturedLawyersGrid() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLawyer, setSelectedLawyer] = useState(null);

  const { data: session } = useSession();
  const currentUser = session?.user;

  useEffect(() => {
    const fetchFeaturedLawyers = async () => {
      try {
        setLoading(true);
        const data = await apiFetch(`/api/lawyers?sort=newest&limit=6`);
        let list = [];
        if (Array.isArray(data)) list = data;
        else if (data && Array.isArray(data.lawyers)) list = data.lawyers;
        const shuffled = [...list].sort(() => Math.random() - 0.5).slice(0, 6);
        setLawyers(shuffled);
      } catch (err) {
        console.error("Failed to fetch lawyers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedLawyers();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-72 rounded-3xl" />
        ))}
      </div>
    );
  }

  if (lawyers.length === 0) {
    return (
      <p className="text-center text-slate-400 dark:text-slate-500 mt-10 text-sm">
        No lawyers found. Please check back later.
      </p>
    );
  }

  return (
    <>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
      >
        {lawyers.map((lawyer) => (
          <motion.div
            key={lawyer._id}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
            }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            onClick={() => setSelectedLawyer(lawyer)}
            className="group relative flex flex-col items-center text-center rounded-3xl border border-slate-200/80 bg-white/90 dark:border-slate-800 dark:bg-slate-900/90 px-10 py-8 shadow-sm cursor-pointer transition-all duration-300 hover:border-amber-400 hover:shadow-lg overflow-hidden w-full"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-amber-500/10" />

            {lawyer.imageUrl ? (
              <Image
                src={lawyer.imageUrl}
                alt={lawyer.name}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800 relative"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-2xl font-bold ring-2 ring-slate-100 dark:ring-slate-800 relative">
                {lawyer.name ? lawyer.name.charAt(0).toUpperCase() : "L"}
              </div>
            )}

            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white relative">
              {lawyer.name}
            </h3>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-1 relative">
              {lawyer.specialization}
            </p>

            <div className="mt-3 flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-300 relative">
              <Banknote size={15} className="text-emerald-500" />
              ৳{lawyer.fee}
              <span className="text-xs font-normal text-slate-400">/session</span>
            </div>

            <Chip
              size="sm"
              color={lawyer.status === "Busy" ? "danger" : "success"}
              variant="flat"
              className="text-xs mt-3 relative"
            >
              {lawyer.status || "Available"}
            </Chip>

            <Button
              size="sm"
              className="mt-5 font-bold rounded-xl w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 relative"
              onPress={() => setSelectedLawyer(lawyer)}
            >
              View Profile
            </Button>
          </motion.div>
        ))}
      </motion.div>

      <LawyerDetailModal
        selectedLawyer={selectedLawyer}
        onClose={() => setSelectedLawyer(null)}
        currentUser={currentUser}
      />
    </>
  );
}
