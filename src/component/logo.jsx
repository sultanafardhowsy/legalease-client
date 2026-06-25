import Image from "next/image";
import logoLight from "@/asset/logo-light.png";
import logoDark from "@/asset/logo-dark.png";

export default function Logo() {
  return (
    <>
      <Image
        src={logoLight}
        alt="LegalEase"
        width={150}
        height={45}
        className="block dark:hidden"
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