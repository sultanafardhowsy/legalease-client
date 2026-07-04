"use client";

import { useEffect, useState } from "react";
import { Button, Chip, Skeleton } from "@heroui/react";
import Link from "next/link";
import { BadgeDollarSign, Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/core/api";
import { LawyerDetailModal } from "@/component/LawyerDetailModal";

export default function FeaturedLawyers() {
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

  return (
    <section className="py-20 px-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div>
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-amber-500 dark:text-amber-400 mb-2">
              Handpicked for You
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Featured Lawyers
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-lg">
              Browse our newest verified legal professionals ready to take your case.
            </p>
          </div>
          <Link
            href="/lawyers"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:underline shrink-0"
          >
            View all lawyers <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* Skeleton */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-3xl" />
            ))}
          </div>
        )}

        {/* Cards */}
        {!loading && (
          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
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
                whileHover={{ y: -6, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                onClick={() => setSelectedLawyer(lawyer)}
                className="group relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-xl dark:hover:shadow-slate-800/50 cursor-pointer transition-shadow duration-300 overflow-hidden"
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    {lawyer.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={lawyer.imageUrl}
                        alt={lawyer.name}
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl font-bold ring-2 ring-slate-100 dark:ring-slate-800">
                        {lawyer.name ? lawyer.name.charAt(0).toUpperCase() : "L"}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-400" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                      {lawyer.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {lawyer.specialization}
                    </p>

                    {/* Fake star rating */}
                    <div className="flex items-center gap-0.5 mt-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={11}
                          className={i < 4 ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-slate-600"}
                        />
                      ))}
                      <span className="text-xs text-slate-400 ml-1">4.0</span>
                    </div>
                  </div>
                </div>

                {/* Bottom row */}
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      <BadgeDollarSign size={15} className="text-emerald-500" />
                      ৳{lawyer.fee}
                      <span className="text-xs font-normal text-slate-400">/session</span>
                    </div>
                    <Chip
                      size="sm"
                      color={lawyer.status === "Busy" ? "danger" : "success"}
                      variant="flat"
                      className="text-xs"
                    >
                      {lawyer.status || "Available"}
                    </Chip>
                  </div>

                  <Button
                    size="sm"
                    className="font-semibold rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs px-3"
                    onPress={() => setSelectedLawyer(lawyer)}
                  >
                    View
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty state */}
        {!loading && lawyers.length === 0 && (
          <p className="text-center text-slate-400 dark:text-slate-500 mt-10 text-sm">
            No lawyers found. Please check back later.
          </p>
        )}

        {/* Detail Modal */}
        <LawyerDetailModal
          selectedLawyer={selectedLawyer}
          onClose={() => setSelectedLawyer(null)}
          currentUser={currentUser}
        />
      </div>
    </section>
  );
}