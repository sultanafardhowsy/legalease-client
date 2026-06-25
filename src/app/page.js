


import BannerPage from "./banner/page";
import LawyerSection from "./banner2/page";
import FeaturedLawyers from "./featuredlawyers/page";




export default function Home() {
  return (
    
    <div className="mb-10 flex flex-col gap-16">
      
      <BannerPage />
      <FeaturedLawyers />
    <LawyerSection />
       
      
    </div>
  );
}
