import { Suspense } from "react";
import { io } from "next/cache";
import EarthquakeDashboard from "@/components/EarthquakeDashboard";

export default function Home() {
  return (
    <Suspense fallback={<main className="dashboard-shell" aria-busy="true" />}>
      <CurrentDashboard />
    </Suspense>
  );
}

async function CurrentDashboard() {
  await io();
  return <EarthquakeDashboard />;
}
