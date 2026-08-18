import type { Metadata } from "next";
import { teach as copy } from "@/content";
import { Container, Section } from "@/components/ui/Primitives";
import { TeacherInbox } from "@/components/teach/TeacherInbox";

export const metadata: Metadata = {
  title: copy.inbox.meta.title,
  description: copy.inbox.meta.description,
};

export default function TeacherInboxPage() {
  return (
    <Section className="py-10 sm:py-14">
      <Container className="max-w-3xl">
        <TeacherInbox />
      </Container>
    </Section>
  );
}
