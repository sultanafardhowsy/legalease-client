import BannerPage from "./banner/page";
import FeaturedLawyers from "./featuredlawyers/page";
import HowItWorks from "./howitworks/page";
import LawyerSection from "./banner2/page";
import LegalCategories from "./legalcategories/page";
import CTABanner from "./ctabanner/page";

export default function Home() {
  return (
    <div className="flex flex-col">
      <BannerPage />
      <FeaturedLawyers />
      <HowItWorks />
      <LawyerSection />
      <LegalCategories />
      <CTABanner />
    </div>
  );
}
