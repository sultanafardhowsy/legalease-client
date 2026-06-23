import { Suspense } from "react";
import BrowseLawyersPage from "@/component/BrowseLawyersPage";

export default function BrowseLawyerPage() {

 return (
        <Suspense fallback={null}>
      <BrowseLawyersPage />
    </Suspense>
        
       
    );
}