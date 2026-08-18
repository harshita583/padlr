"use client";

import { useSearchParams } from "next/navigation";
import { TeacherThreadFeed } from "./TeacherThreadFeed";

/** Reads which conversation to show from the URL, so the page itself can stay a server component. */
export function TeacherThreadFeedRoute() {
  const params = useSearchParams();
  const ref = params.get("ref") ?? "";
  return <TeacherThreadFeed threadHref={ref} />;
}
