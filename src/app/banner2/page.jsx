"use client";

import { useEffect, useState } from "react";
import { Avatar, Button } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/core/api";
import {LawyerDetailModal} from "@/component/LawyerDetailModal";




const medalColors = ["#008000", "#FFA500", "#CD7F32"];
const medalLabels = ["1st", "2nd", "3rd"];

export default function TopLegalExperts() {
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

  return (
    <div className="py-16 px-4 max-w-screen-xl mx-auto">

      {/* Section Header */}
      <motion.div
        className="mb-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy size={24} className="text-amber-500" />
          <h2 className="text-3xl font-bold text-foreground">
            Top Legal Experts
          </h2>
        </div>
        <p className="text-default-500 text-sm mt-1">
          Most hired lawyers on our platform
        </p>
      </motion.div>

      {/* Skeleton */}
      {loading && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-64 w-full sm:w-64 rounded-3xl bg-default-100 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Cards */}
      {!loading && lawyers.length > 0 && (
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
              {/* Medal Badge */}
              <div
                className="text-xs font-bold px-3 py-1 rounded-full mb-4 text-white"
                style={{ backgroundColor: medalColors[i] }}
              >
                {medalLabels[i]} Place
              </div>

              {/* Avatar */}
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

              {/* Name */}
              <h3 className="mt-4 text-base font-bold text-foreground">
                {lawyer.name}
              </h3>

              {/* Specialization */}
              <p className="mt-1 text-xs text-default-500 line-clamp-1">
                {lawyer.specialization}
              </p>

              {/* Hire Count */}
              <div
                className="mt-3 text-sm font-semibold"
                style={{ color: medalColors[i] }}
              >
                {lawyer.hireCount ?? 0} Hires
              </div>

              {/* View Profile Button */}
              <Button
                size="sm"
                color="primary"
                className="mt-5 font-bold rounded-xl w-full"
                onPress={() => handleViewProfile(lawyer, i)}
              >
                View Profile
              </Button>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && lawyers.length === 0 && (
        <motion.p
          className="text-center text-default-400 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No data available yet.
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