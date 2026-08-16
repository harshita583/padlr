import type { Metadata } from "next";
import { profile as copy } from "@/content";
import { Container, Section } from "@/components/ui/Primitives";
import { ProfileView } from "@/components/profile/ProfileView";
import { TeachingPanel } from "@/components/teach/TeachingPanel";

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
};

export default function ProfilePage() {
  return (
    <Section className="py-10 sm:py-14">
      <Container className="max-w-4xl">
        <TeachingPanel />
        <ProfileView />
      </Container>
    </Section>
  );
}
