"use client";

import { useEffect, useState } from "react";
import { Avatar, Button } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { motion } from "framer-motion";

import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/core/api";
import { LawyerDetailModal } from "@/component/LawyerDetailModal";

const medalColors = ["#D4A017", "#FFA500", "#CD7F32"];
const medalLabels = ["1st", "2nd", "3rd"];

export default function TopLegalExpertsList() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLawyer, setSelectedLawyer] = useState(null);

  const { data: session } = useSession();
  const currentUser = session?.user;

  useEffect(() => {
    const fetchTopLawyers = async () => {
      try {
        const data = await apiFetch(`/api/lawyers/top`);
        setLawyers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch top lawyers:", err);
        addToast({
          title: "Failed to load top lawyers",
          description: "Please try refreshing the page.",
          color: "danger",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTopLawyers();
  }, []);

  const handleViewProfile = (lawyer, index) => {
    setSelectedLawyer(lawyer);
    addToast({
      title: `Viewing ${lawyer.name}`,
      description: `${medalLabels[index]} place · ${lawyer.specialization}`,
      color: "success",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-64 w-full sm:w-64 rounded-3xl bg-default-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (lawyers.length === 0) {
    return (
      <motion.p
        className="text-center text-default-400 mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        No data available yet.
      </motion.p>
    );
  }

  return (
    <>
      <motion.div
        className="flex flex-col sm:flex-row justify-center items-center gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
          },
        }}
      >
        {lawyers.map((lawyer, i) => (
          <motion.div
            key={lawyer._id}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: "easeOut" },
              },
            }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center text-center bg-white dark:bg-slate-900 border border-divider rounded-3xl px-10 py-8 shadow-sm w-full sm:w-80"
          >
            <div
              className="text-xs font-bold px-3 py-1 rounded-full mb-4 text-white"
              style={{ backgroundColor: medalColors[i] }}
            >
              {medalLabels[i]} Place
            </div>

            <Avatar className="h-20 w-20">
              {lawyer.imageUrl && (
                <Avatar.Image
                  src={lawyer.imageUrl}
                  alt={lawyer.name || "Lawyer"}
                />
              )}
              <Avatar.Fallback>
                {lawyer.name ? lawyer.name.charAt(0).toUpperCase() : "L"}
              </Avatar.Fallback>
            </Avatar>

            <h3 className="mt-4 text-base font-bold text-foreground">
              {lawyer.name}
            </h3>

            <p className="mt-1 text-xs text-default-500 line-clamp-1">
              {lawyer.specialization}
            </p>

            <div
              className="mt-3 text-sm font-semibold"
              style={{ color: medalColors[i] }}
            >
              {lawyer.hireCount ?? 0} Hires
            </div>

            <Button
              size="sm"
              className="mt-5 font-bold rounded-xl w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600"
              onPress={() => handleViewProfile(lawyer, i)}
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
