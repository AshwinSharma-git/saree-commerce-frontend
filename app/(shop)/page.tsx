import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { CollectionsBento } from "@/components/home/CollectionsBento";
import { NewArrivals } from "@/components/home/NewArrivals";
import { HeritageStory } from "@/components/home/HeritageStory";
import { InstagramRail } from "@/components/home/InstagramRail";
import { Testimonials } from "@/components/home/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <CollectionsBento />
      <NewArrivals />
      <HeritageStory />
      <InstagramRail />
      <Testimonials />
    </>
  );
}
