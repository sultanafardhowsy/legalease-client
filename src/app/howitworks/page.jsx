"use client";

import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    icon: "🔍",
    title: "Browse & Search",
    description: "Search our verified directory of 500+ lawyers by practice area, location, or fee range.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    step: "02",
    icon: "📋",
    title: "Review Profiles",
    description: "Read detailed profiles, specializations, client reviews, and transparent consultation fees.",
    color: "from-amber-500 to-orange-500",
  },
  {
    step: "03",
    icon: "🤝",
    title: "Hire Instantly",
    description: "Send a hire request directly. Get connected within hours and start your consultation.",
    color: "from-emerald-500 to-teal-600",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-500">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent -z-10" />

      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-amber-600 dark:text-amber-400 mb-3 px-4 py-1.5 rounded-full border border-amber-600/30 dark:border-amber-400/30 bg-amber-600/10">
            Simple Process
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            How LegalEase Works
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Getting expert legal help has never been this straightforward. Three steps to your lawyer.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid gap-8 md:grid-cols-3 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-[52px] left-[calc(16.6%+1rem)] right-[calc(16.6%+1rem)] h-px bg-slate-200 dark:bg-slate-800" />

          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.18, ease: "easeOut" }}
              whileHover={{ y: -6 }}
              className="relative flex flex-col items-center text-center rounded-3xl p-8 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm shadow-xl dark:shadow-none"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 bg-gradient-to-br ${s.color} shadow-lg`}
              >
                {s.icon}
              </div>

              <span className="text-xs font-bold tracking-widest text-slate-500 dark:text-slate-500 mb-2">
                STEP {s.step}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{s.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}