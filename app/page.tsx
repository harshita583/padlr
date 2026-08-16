import type { Metadata } from "next";
import { home } from "@/content";
import { getCategories, getEvents, getExpertById } from "@/lib/data";
import type { Expert } from "@/lib/types";
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { EventsRail } from "@/components/home/EventsRail";
import { ProofCollage } from "@/components/home/ProofCollage";
import { TogetherCollage } from "@/components/home/TogetherCollage";
import { HowItWorks } from "@/components/home/HowItWorks";
import { TeachPoster } from "@/components/home/TeachPoster";

export const metadata: Metadata = {
  title: home.meta.title,
  description: home.meta.description,
};

export default async function HomePage() {
  const [categories, allEvents] = await Promise.all([getCategories(), getEvents()]);
  const events = allEvents.slice(0, 4);

  const hosts: Record<string, Expert | undefined> = {};
  for (const event of events) {
    hosts[event.hostId] = await getExpertById(event.hostId);
  }

  return (
    <>
      <Hero />
      <CategoryGrid categories={categories} />
      <EventsRail events={events} hosts={hosts} />
      <ProofCollage />
      <TogetherCollage />
      <HowItWorks />
      <TeachPoster />
    </>
  );
}
