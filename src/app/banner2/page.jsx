"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button, Avatar, Chip, Skeleton } from "@heroui/react";
import Link from "next/link";
import {
  Scale,
  ShieldCheck,
  Clock,
  Star,
  ArrowRight,
  BriefcaseBusiness,
  BadgeDollarSign,
  Search,
} from "lucide-react";

export default function ClientHomePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedLawyers();
  }, []);

  const fetchFeaturedLawyers = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/lawyers?sort=newest&limit=3`
      );
      const data = await res.json();
      setLawyers(Array.isArray(data) ? data.slice(0, 3) : []);
    } catch (err) {
      console.error("Failed to fetch lawyers:", err);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      icon: <Search size={28} />,
      title: "Search Lawyers",
      desc: "Browse verified legal professionals by specialization.",
    },
    {
      icon: <BriefcaseBusiness size={28} />,
      title: "Send Request",
      desc: "Send a consultation request to your chosen lawyer.",
    },
    {
      icon: <ShieldCheck size={28} />,
      title: "Get Approved",
      desc: "Wait for the lawyer to review and accept your request.",
    },
    {
      icon: <BadgeDollarSign size={28} />,
      title: "Make Payment",
      desc: "Pay securely and begin your legal consultation.",
    },
  ];

  const features = [
    {
      icon: <ShieldCheck size={24} className="text-blue-600" />,
      title: "Verified Lawyers",
      desc: "Every lawyer on our platform is verified and background checked.",
      bg: "bg-blue-50",
    },
    {
      icon: <Clock size={24} className="text-amber-600" />,
      title: "Fast Response",
      desc: "Get responses from lawyers within 24 hours of your request.",
      bg: "bg-amber-50",
    },
    {
      icon: <Scale size={24} className="text-green-600" />,
      title: "All Practice Areas",
      desc: "From corporate law to family law — find the right expert.",
      bg: "bg-green-50",
    },
    {
      icon: <Star size={24} className="text-purple-600" />,
      title: "Transparent Pricing",
      desc: "See consultation fees upfront before sending any request.",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-16 pb-20">

      {/* Hero Section */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-700 p-10 md:p-16 text-white shadow-lg">
        <p className="text-sm uppercase tracking-widest text-slate-300">
          Welcome to LegalEase
        </p>
        <h1 className="mt-4 text-4xl font-bold md:text-6xl leading-tight">
          Legal Help, <br />
          <span className="text-amber-400">Made Simple.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-slate-300">
          Connect with verified lawyers, send consultation requests, and get
          expert legal advice — all from one place.
          {user?.name && (
            <span className="block mt-2 text-white font-semibold">
              Welcome back, {user.name} 👋
            </span>
          )}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button
            as={Link}
            href="/lawyers"
            color="primary"
            size="lg"
            className="font-bold rounded-xl"
          >
            Browse Lawyers
            <ArrowRight size={18} />
          </Button>
          <Button
            as={Link}
            href="/dashboard/user/hiring-history"
            variant="flat"
            size="lg"
            className="font-bold rounded-xl bg-white/10 text-white hover:bg-white/20"
          >
            My Requests
          </Button>
        </div>
      </div>

      {/* How It Works */}
      <div>
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-default-400">
            How It Works
          </p>
          <h2 className="mt-2 text-3xl font-bold text-foreground">
            4 Simple Steps
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {steps.map((step, i) => (
            <div
              key={i}
              className="rounded-3xl border border-divider bg-white p-6 shadow-sm relative"
            >
              <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-slate-900 text-white text-sm font-bold flex items-center justify-center">
                {i + 1}
              </div>
              <div className="text-slate-700 mb-4">{step.icon}</div>
              <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm text-default-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Lawyers */}
      <div>
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-default-400">
              Our Lawyers
            </p>
            <h2 className="mt-2 text-3xl font-bold text-foreground">
              Featured Lawyers
            </h2>
          </div>
          <Button
            as={Link}
            href="/lawyers"
            variant="flat"
            className="font-semibold rounded-xl"
            endContent={<ArrowRight size={16} />}
          >
            View All
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {loading &&
            [...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-3xl" />
            ))}

          {!loading &&
            lawyers.map((lawyer) => (
              <div
                key={lawyer._id}
                className="rounded-3xl border border-divider bg-white p-6 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300"
              >
                <Avatar className="h-20 w-20">
                  {lawyer.imageUrl ? (
                    <Avatar.Image src={lawyer.imageUrl} alt={lawyer.name} />
                  ) : null}
                  <Avatar.Fallback>
                    {lawyer.name?.charAt(0).toUpperCase() || "L"}
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
                  href="/lawyers"
                  size="sm"
                  color="primary"
                  className="mt-5 font-bold rounded-xl w-full"
                >
                  View Profile
                </Button>
              </div>
            ))}
        </div>
      </div>

      {/* Why LegalEase */}
      <div>
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-default-400">
            Why Us
          </p>
          <h2 className="mt-2 text-3xl font-bold text-foreground">
            Why Choose LegalEase?
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={i}
              className={`rounded-3xl border border-divider ${f.bg} p-6 shadow-sm`}
            >
              <div className="mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="rounded-3xl border bg-amber-50 p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-bold text-foreground">
            Ready to Find Your Lawyer?
          </h3>
          <p className="mt-2 max-w-xl text-gray-600">
            Browse our network of verified legal professionals and get the help
            you need today.
          </p>
        </div>
        <Button
          as={Link}
          href="/lawyers"
          color="primary"
          size="lg"
          className="font-bold rounded-xl shrink-0"
        >
          Get Started
          <ArrowRight size={18} />
        </Button>
      </div>

    </div>
  );
}