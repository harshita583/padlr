const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NOTION_VERSION = "2022-06-28";

/**
 * Adds an email to a Notion database.
 *
 * Needs two things in the environment (see .env.local.example):
 *   NOTION_API_KEY              — an internal integration secret
 *   NOTION_WAITLIST_DATABASE_ID — the database to write into
 *
 * The only real requirement is Notion's own: every database has exactly one
 * title property, whatever it's called ("Name" by default) — this reads the
 * schema each time and writes the email into that one, so renaming it in
 * Notion doesn't break anything here. If the database also has a property of
 * type "email" (any name), that gets filled in too, as a real Notion email
 * field rather than plain text. Neither is hard-coded, because asking
 * somebody to rename a column to match a route handler is backwards.
 */
export async function POST(request: Request) {
  let email: unknown;
  try {
    ({ email } = await request.json());
  } catch {
    return Response.json({ error: "Bad request." }, { status: 400 });
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return Response.json(
      { error: "That doesn't look like an email address." },
      { status: 400 },
    );
  }

  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_WAITLIST_DATABASE_ID;

  if (!apiKey || !databaseId) {
    console.error(
      "Waitlist: set NOTION_API_KEY and NOTION_WAITLIST_DATABASE_ID to enable this route.",
    );
    return Response.json({ error: "Waitlist isn't configured yet." }, { status: 500 });
  }

  const notionHeaders = {
    Authorization: `Bearer ${apiKey}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };

  const schemaRes = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
    headers: notionHeaders,
  });

  if (!schemaRes.ok) {
    console.error("Waitlist: couldn't read the database schema.", schemaRes.status, await schemaRes.text());
    return Response.json({ error: "Something went wrong. Try again shortly." }, { status: 502 });
  }

  const schema = await schemaRes.json();
  const properties: Record<string, { type: string }> = schema.properties ?? {};
  const titleProp = Object.entries(properties).find(([, p]) => p.type === "title")?.[0];
  const emailProp = Object.entries(properties).find(([, p]) => p.type === "email")?.[0];

  if (!titleProp) {
    console.error("Waitlist: the database has no title property — Notion requires one.");
    return Response.json({ error: "Something went wrong. Try again shortly." }, { status: 502 });
  }

  const notionRes = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: notionHeaders,
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties: {
        [titleProp]: { title: [{ text: { content: email } }] },
        ...(emailProp ? { [emailProp]: { email } } : {}),
      },
    }),
  });

  if (!notionRes.ok) {
    // Logged server-side only — a Notion error can mention the database
    // schema, which isn't something to hand back to the browser.
    console.error("Waitlist: Notion rejected the request.", notionRes.status, await notionRes.text());
    return Response.json({ error: "Something went wrong. Try again shortly." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
