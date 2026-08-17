const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Adds an email to a Notion database.
 *
 * Needs two things in the environment (see .env.local.example):
 *   NOTION_API_KEY              — an internal integration secret
 *   NOTION_WAITLIST_DATABASE_ID — the database to write into
 *
 * The database needs exactly one property this route depends on: a title
 * column named "Email". Add anything else you like on top (a "Created time"
 * column is the easy way to get a timestamp — Notion fills that in itself).
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

  const notionRes = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties: {
        Email: { title: [{ text: { content: email } }] },
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
