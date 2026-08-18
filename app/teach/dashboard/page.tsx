import type { Metadata } from "next";
import { teach as copy } from "@/content";
import { Container, Section } from "@/components/ui/Primitives";
import { EarningsDashboard } from "@/components/teach/EarningsDashboard";

export const metadata: Metadata = {
  title: copy.dashboard.meta.title,
  description: copy.dashboard.meta.description,
};

export default function TeachDashboardPage() {
  return (
    <Section className="py-10 sm:py-14">
      <Container className="max-w-4xl">
        <EarningsDashboard />
      </Container>
    </Section>
  );
}
