/** The waitlist popup, shown once to a first-time homepage visitor. */

export const waitlist = {
  eyebrow: "Not in your city yet?",
  title: "Get on the list",
  body: "We're opening city by city. Leave your email and we'll let you know the moment Padlr reaches you.",
  closeLabel: "Close",
  emailLabel: "Email address",
  placeholder: "you@example.com",
  submit: "Join the waitlist",
  submitting: "Joining…",
  success: "You're on the list — we'll email you when we launch nearby.",
  errors: {
    required: "Enter your email address.",
    invalid: "That doesn't look like an email address.",
    server: "Something went wrong on our end. Try again in a moment.",
  },
  privacyNote: "Only used to tell you about the launch. No spam, ever.",
  /** The quiet way back in for anyone who closed the popup without joining. */
  footerCta: "Join the waitlist",
} as const;
