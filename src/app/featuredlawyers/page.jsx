"use client";

import { useEffect, useState } from "react";
import { Button, Avatar, Chip, Skeleton } from "@heroui/react";
import Link from "next/link";
import { BadgeDollarSign } from "lucide-react";
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
    fetchFeaturedLawyers();
  }, []);

  const fetchFeaturedLawyers = async () => {
    try {
      setLoading(true);
      const data = await apiFetch(`/api/lawyers?sort=newest&limit=6`);
      let list = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (data && Array.isArray(data.lawyers)) {
        list = data.lawyers;
      }
      const shuffled = [...list].sort(() => Math.random() - 0.5).slice(0, 6);
      setLawyers(shuffled);
    } catch (err) {
      console.error("Failed to fetch lawyers:", err);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="py-8 px-8 max-w-full mx-auto">
      {/* Section Header */}
      <motion.div
        className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-10"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div>
          <h2 className="mt-2 text-3xl font-bold text-foreground">
            Featured Lawyers
          </h2>
        </div>
      </motion.div>

      {/* Skeleton Loading */}
      {loading && (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-3xl" />
          ))}
        </div>
      )}

      {/* Lawyer Cards */}
      {!loading && (
        <motion.div
          className="grid gap-16 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {lawyers.map((lawyer) => (
            <motion.div
              key={lawyer._id}
              variants={cardVariants}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 280, damping: 20 }}
              className="rounded-3xl border border-divider bg-white p-10 shadow-sm flex flex-col items-center text-center cursor-pointer"
            >
              <Avatar className="h-28 w-28">
                {lawyer.imageUrl && (
                  <Avatar.Image
                    src={lawyer.imageUrl}
                    alt={lawyer.name || "Lawyer profile"}
                  />
                )}
                <Avatar.Fallback>
                  {lawyer.name ? lawyer.name.charAt(0).toUpperCase() : "L"}
                </Avatar.Fallback>
              </Avatar>

              <h3 className="mt-4 text-lg font-bold text-foreground">
                {lawyer.name}
              </h3>

              <p className="mt-1 text-sm text-default-500 line-clamp-1">
                {lawyer.specialization}
              </p>

              <div className="mt-3 flex items-center gap-1 text-sm font-semibold text-foreground">
                <BadgeDollarSign size={16} className="text-success" />
                 {lawyer.fee} 
              </div>

              <Chip
                className="mt-3"
                size="sm"
                color={lawyer.status === "Busy" ? "danger" : "success"}
                variant="flat"
              >
                {lawyer.status || "Available"}
              </Chip>

              <Button
                size="sm"
                color="primary"
                className="mt-5 font-bold rounded-xl w-full"
                onPress={() => setSelectedLawyer(lawyer)}
              >
                View Profile
              </Button>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Empty state */}
      {!loading && lawyers.length === 0 && (
        <motion.p
          className="text-center text-default-400 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No lawyers found. Please check back later.
        </motion.p>
      )}

      {/* Detail Modal */}
      <LawyerDetailModal
        selectedLawyer={selectedLawyer}
        onClose={() => setSelectedLawyer(null)}
        currentUser={currentUser}
      />
    </div>
  );
}