"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/toast";
import { apiFetch } from "@/lib/core/api";
import {
  FileText,
  Briefcase,
  Heart,
  ShieldAlert,
  Globe,
  Home,
  Lightbulb,
  Users,
  Receipt,
  Ambulance,
  Scale,
  Landmark,
} from "lucide-react";

const iconMap = {
  "Contract Drafting":   FileText,
  "Corporate Law":       Briefcase,
  "Family Law":          Heart,
  "Criminal Defense":    ShieldAlert,
  "Immigration Law":     Globe,
  "Real Estate Law":     Home,
  "Intellectual Property": Lightbulb,
  "Employment Law":      Users,
  "Tax Law":             Receipt,
  "Personal Injury":     Ambulance,
  "Civil Litigation":    Scale,
  "Bankruptcy Law":      Landmark,
};

const colorMap = {
  "Contract Drafting":     { bg: "bg-blue-50 dark:bg-blue-950",     icon: "text-blue-500",   border: "hover:border-blue-400",   badge: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300" },
  "Corporate Law":         { bg: "bg-purple-50 dark:bg-purple-950", icon: "text-purple-500", border: "hover:border-purple-400", badge: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300" },
  "Family Law":            { bg: "bg-pink-50 dark:bg-pink-950",     icon: "text-pink-500",   border: "hover:border-pink-400",   badge: "bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300" },
  "Criminal Defense":      { bg: "bg-red-50 dark:bg-red-950",       icon: "text-red-500",    border: "hover:border-red-400",    badge: "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300" },
  "Immigration Law":       { bg: "bg-cyan-50 dark:bg-cyan-950",     icon: "text-cyan-500",   border: "hover:border-cyan-400",   badge: "bg-cyan-100 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-300" },
  "Real Estate Law":       { bg: "bg-green-50 dark:bg-green-950",   icon: "text-green-500",  border: "hover:border-green-400",  badge: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300" },
  "Intellectual Property": { bg: "bg-yellow-50 dark:bg-yellow-950", icon: "text-yellow-500", border: "hover:border-yellow-400", badge: "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300" },
  "Employment Law":        { bg: "bg-orange-50 dark:bg-orange-950", icon: "text-orange-500", border: "hover:border-orange-400", badge: "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300" },
  "Tax Law":               { bg: "bg-teal-50 dark:bg-teal-950",     icon: "text-teal-500",   border: "hover:border-teal-400",   badge: "bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300" },
  "Personal Injury":       { bg: "bg-rose-50 dark:bg-rose-950",     icon: "text-rose-500",   border: "hover:border-rose-400",   badge: "bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-300" },
  "Civil Litigation":      { bg: "bg-indigo-50 dark:bg-indigo-950", icon: "text-indigo-500", border: "hover:border-indigo-400", badge: "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300" },
  "Bankruptcy Law":        { bg: "bg-slate-50 dark:bg-slate-800",   icon: "text-slate-500",  border: "hover:border-slate-400",  badge: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300" },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function LegalCategories() {
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await apiFetch(`/api/services`);
        setServices(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch services:", err);
        addToast({
          title: "Failed to load categories",
          description: "Please try refreshing the page.",
          color: "danger",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleClick = (service) => {
    addToast({
      title: `Browsing ${service.name}`,
      description: "Showing lawyers for this category.",
      color: "primary",
    });
    router.push(`/lawyers?spec=${encodeURIComponent(service.name)}`);
  };

  return (
    <div className="py-16 px-6 md:px-8 max-w-screen-xl mx-auto">

      {/* Header */}
      <motion.div
        className="mb-12 text-center"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-3">
          Practice Areas
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Legal Categories
        </h2>
        <p className="mt-3 text-default-500 text-sm md:text-base max-w-xl mx-auto">
          Find the right legal expert for your specific needs. Click any category to browse available lawyers.
        </p>
      </motion.div>

      {/* Skeleton */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="h-44 rounded-2xl bg-default-100 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Grid */}
      {!loading && services.length > 0 && (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {services.map((service) => {
            const Icon   = iconMap[service.name]   || Scale;
            const colors = colorMap[service.name]  || colorMap["Civil Litigation"];

            return (
              <motion.div
                key={service._id}
                variants={cardVariants}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleClick(service)}
                className={`
                  relative flex flex-col items-center justify-center gap-3
                  rounded-2xl border border-divider
                  bg-white dark:bg-default-50
                  px-5 py-7 shadow-sm
                  cursor-pointer transition-all duration-200
                  ${colors.border}
                  hover:shadow-md group overflow-hidden
                `}
              >
                {/* Subtle background blob */}
                <div
                  className={`
                    absolute inset-0 opacity-40 rounded-2xl
                    ${colors.bg}
                  `}
                />

                {/* Icon circle */}
                <div className={`
                  relative z-10 p-3 rounded-xl
                  ${colors.bg}
                  transition-transform duration-200 group-hover:scale-110
                `}>
                  <Icon size={26} className={colors.icon} />
                </div>

                {/* Name */}
                <span className="relative z-10 text-sm font-bold text-foreground text-center leading-snug">
                  {service.name}
                </span>

                {/* Description */}
                <p className="relative z-10 text-xs text-default-400 text-center line-clamp-2 leading-relaxed">
                  {service.description}
                </p>

                {/* Fee badge */}
                <span className={`
                  relative z-10 text-xs font-semibold px-3 py-1 rounded-full
                  ${colors.badge}
                  transition-all duration-200
                `}>
                  From ৳{service.fee}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && services.length === 0 && (
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Scale size={40} className="mx-auto text-default-300 mb-4" />
          <p className="text-default-400 text-sm">No categories available yet.</p>
        </motion.div>
      )}
    </div>
  );
}