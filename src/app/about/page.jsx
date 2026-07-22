import LegalPage from "@/component/LegalPage";


export const metadata = {
  title: "About — LegalEase",
  description: "Learn about LegalEase, Bangladesh&apos;s premier legal marketplace.",
};

export default function AboutPage() {
  return (
    <LegalPage title="About LegalEase" updated="July 2026">
      <p>LegalEase is Bangladesh's premier legal marketplace, connecting people and businesses with verified lawyers across every major practice area. Our mission is to make expert legal help transparent, accessible, and affordable — for everyone.</p>
      <h2>Our story</h2>
      <p>Founded in Dhaka, LegalEase was built to remove friction from finding the right lawyer. Instead of relying on word-of-mouth, users browse verified profiles, compare fees, and hire in a few clicks.</p>
      <h2>What we do</h2>
      <ul>
        <li>Verify every lawyer against Bar Council registration.</li>
        <li>Publish transparent starting fees for every practice area.</li>
        <li>Provide a secure, direct channel between clients and counsel.</li>
      </ul>
      <h2>Our values</h2>
      <p>Justice for all. Transparency in pricing. Respect for privacy.</p>
    </LegalPage>
  );
}
