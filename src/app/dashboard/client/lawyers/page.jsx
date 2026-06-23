import { Suspense } from "react";
import BrowseLawyersPage from "@/component/BrowseLawyersPage";

export default function DashboardClientLawyersPage() {
  return (
    <Suspense fallback={null}>
      <BrowseLawyersPage />
    </Suspense>
  );
}