import { Suspense } from "react";
import TrackingClient from "./TrackingClient";

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <TrackingClient />
    </Suspense>
  );
}
