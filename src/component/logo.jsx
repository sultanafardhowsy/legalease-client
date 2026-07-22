"use client";

import Image from "next/image";
import logoLight from "@/asset/logo-light.png";
import logoDark from "@/asset/logo-dark.png";
import { useState, useEffect } from "react";

export default function Logo() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (!mounted) {
    // Server and client both render the same thing initially
    return (
      <Image
        src={logoLight}
        alt="LegalEase"
        width={150}
        height={45}
        className="rounded-3xl"
        priority
      />
    );
  }

  return (
    <>
      <Image
        src={logoLight}
        alt="LegalEase"
        width={150}
        height={45}
        className="block dark:hidden rounded-3xl"
        priority
      />
      <Image
        src={logoDark}
        alt="LegalEase"
        width={150}
        height={45}
        className="hidden dark:block"
        priority
      />
    </>
  );
}