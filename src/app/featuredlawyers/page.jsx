"use client";

import { useEffect, useState } from "react";
import { Button, Avatar, Chip, Skeleton } from "@heroui/react";
import Link from "next/link";
import { BadgeDollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function FeaturedLawyers() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedLawyers();
  }, []);

  const fetchFeaturedLawyers = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/lawyers?sort=newest&limit=6`
      );
      const data = await res.json();

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
        staggerChildren: 0.12,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="py-16 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <motion.div
        className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <div>
          <h2 className="mt-2 text-3xl font-bold text-foreground">
            Featured Lawyers
          </h2>
        </div>
        <Button
          as={Link}
          href="/lawyers"
          variant="bordered"
          size="sm"
          className="rounded-xl font-semibold self-start md:self-auto"
        >
          View All Lawyers
        </Button>
      </motion.div>

      {/* Skeleton Loading */}
      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-3xl" />
          ))}
        </div>
      )}

      {/* Lawyer Cards */}
      {!loading && (
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {lawyers.map((lawyer) => (
            <motion.div
              key={lawyer._id}
              variants={cardVariants}
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ type: "spring", stiffness: 280, damping: 20 }}
              className="rounded-3xl border border-divider bg-white p-6 shadow-sm flex flex-col items-center text-center cursor-pointer"
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
                ৳ {lawyer.fee} BDT
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
                as={Link}
                href={`/lawyers/${lawyer._id}`}
                size="sm"
                color="primary"
                className="mt-5 font-bold rounded-xl w-full"
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
    </div>
  );
}