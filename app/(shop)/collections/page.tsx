import { Suspense } from "react";
import CollectionsBrowser from "./CollectionsBrowser";

export default function CollectionsPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <CollectionsBrowser />
    </Suspense>
  );
}
