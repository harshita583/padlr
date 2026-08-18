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
import { VIEW_MODE_EVENT, resolveViewMode } from "@/lib/viewMode";
import { RoleSwitch } from "./RoleSwitch";

/**
 * The right-hand slot in the header: a sign-up button, or a face once there's
 * a profile — the teacher's, the learner's, or (rare) whichever the role
 * switch is currently set to, when both exist.
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
    // The *_EVENTs cover this tab; "storage" covers the others.
    window.addEventListener(PROFILE_EVENT, read);
    window.addEventListener(TEACHER_EVENT, read);
    window.addEventListener(VIEW_MODE_EVENT, read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener(PROFILE_EVENT, read);
      window.removeEventListener(TEACHER_EVENT, read);
      window.removeEventListener(VIEW_MODE_EVENT, read);
      window.removeEventListener("storage", read);
    };
  }, []);

  if (!mounted || (!profile && !teacher)) {
    return (
      <ButtonLink href={nav.cta.href} size="sm" className="hidden sm:inline-flex">
        {nav.cta.label}
      </ButtonLink>
    );
  }

  const mode = resolveViewMode({ hasTeacher: !!teacher, hasLearner: !!profile });
  const showingTeacher = mode === "teacher" && !!teacher;

  const name = showingTeacher ? teacherName(teacher) : displayName(profile!);
  const initials = showingTeacher ? teacherInitials(teacher) : initialsOf(profile!);

  return (
    <div className="flex items-center gap-2.5">
      {profile && teacher ? <RoleSwitch mode={mode} className="hidden sm:inline-flex" /> : null}
      <Link
        href={nav.profile.href}
        aria-label={nav.profile.labelFor(name)}
        className="grid size-10 shrink-0 place-items-center rounded-full bg-sage text-[0.8125rem] font-bold text-olive transition-transform duration-200 hover:scale-105"
      >
        <span aria-hidden="true">{initials}</span>
      </Link>
    </div>
  );
}
