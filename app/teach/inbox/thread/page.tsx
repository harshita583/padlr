import type { Metadata } from "next";
import { Suspense } from "react";
import { teach as copy } from "@/content";
import { Container, Section } from "@/components/ui/Primitives";
import { TeacherThreadFeedRoute } from "@/components/teach/TeacherThreadFeedRoute";

export const metadata: Metadata = {
  title: copy.inbox.meta.title,
  description: copy.inbox.meta.description,
};

export default function TeacherThreadPage() {
  return (
    <Section className="py-10 sm:py-14">
      <Container className="max-w-2xl">
        <Suspense fallback={<div className="min-h-[24rem]" />}>
          <TeacherThreadFeedRoute />
        </Suspense>
      </Container>
    </Section>
  );
}
