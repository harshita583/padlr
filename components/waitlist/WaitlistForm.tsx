"use client";

import { useId, useState } from "react";
import { waitlist as copy } from "@/content";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { cn } from "@/lib/utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "submitting" | "success" | "error";

/**
 * The email box in the footer. Posts to /api/waitlist, which forwards the
 * address to Notion — see that route for what it needs to be configured.
 */
export function WaitlistForm({ className }: { className?: string }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setError(copy.errors.required);
      return;
    }
    if (!EMAIL_RE.test(trimmed)) {
      setError(copy.errors.invalid);
      return;
    }

    setError(null);
    setStatus("submitting");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
      setError(copy.errors.server);
    }
  }

  if (status === "success") {
    return (
      <p role="status" className={cn("text-[0.9375rem] font-bold text-forest", className)}>
        <span aria-hidden="true">✓ </span>
        {copy.success}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={className}>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <label htmlFor={`${id}-email`} className="sr-only">
          {copy.emailLabel}
        </label>
        <Input
          id={`${id}-email`}
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          placeholder={copy.placeholder}
          autoComplete="email"
          aria-describedby={error ? `${id}-error` : `${id}-note`}
          aria-invalid={error ? true : undefined}
          className="sm:max-w-[16rem]"
        />
        <Button type="submit" disabled={status === "submitting"} className="shrink-0">
          {status === "submitting" ? copy.submitting : copy.submit}
        </Button>
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm font-medium text-coral">
          {error}
        </p>
      ) : (
        <p id={`${id}-note`} className="mt-2 text-xs text-ink-faint">
          {copy.privacyNote}
        </p>
      )}
    </form>
  );
}
