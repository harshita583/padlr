"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav } from "@/content";
import { ButtonLink } from "@/components/ui/Button";
import {
  PROFILE_EVENT,
  displayName,
  initialsOf,
  readProfile,
  type Profile,
} from "@/lib/profile";
import {
  TEACHER_EVENT,
  readTeacher,
  teacherInitials,
  teacherName,
  type TeacherProfile,
} from "@/lib/teacherStore";

/**
 * The right-hand slot in the header: a sign-up button, or the learner's face
 * once they have a profile.
 *
 * The profile lives in localStorage, which the server can't see — so the
 * button is what renders on the server and on the first client paint, and the
 * avatar swaps in after mount. Reading storage during render would make the
 * two markups disagree.
 */
export function HeaderAccount() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const read = () => {
      setProfile(readProfile());
      setTeacher(readTeacher());
    };
    read();
    // The two *_EVENTs cover this tab; "storage" covers the others.
    window.addEventListener(PROFILE_EVENT, read);
    window.addEventListener(TEACHER_EVENT, read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener(PROFILE_EVENT, read);
      window.removeEventListener(TEACHER_EVENT, read);
      window.removeEventListener("storage", read);
    };
  }, []);

  // Signing up to teach is signing up. Showing somebody "Get started" straight
  // after they published a teaching profile calls them a stranger.
  if (mounted && !profile && teacher) {
    return (
      <Link
        href={nav.profile.href}
        aria-label={nav.profile.labelFor(teacherName(teacher))}
        className="grid size-10 place-items-center rounded-full bg-sage text-[0.8125rem] font-bold text-olive transition-transform duration-200 hover:scale-105"
      >
        <span aria-hidden="true">{teacherInitials(teacher)}</span>
      </Link>
    );
  }

  if (!mounted || !profile) {
    return (
      <ButtonLink href={nav.cta.href} size="sm" className="hidden sm:inline-flex">
        {nav.cta.label}
      </ButtonLink>
    );
  }

  return (
    <Link
      href={nav.profile.href}
      aria-label={nav.profile.labelFor(displayName(profile))}
      className="grid size-10 place-items-center rounded-full bg-sage text-[0.8125rem] font-bold text-olive transition-transform duration-200 hover:scale-105"
    >
      <span aria-hidden="true">{initialsOf(profile)}</span>
    </Link>
  );
}
