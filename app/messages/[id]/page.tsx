import { getThread, getThreads } from "@/lib/data";
import { CircleThread } from "@/components/messages/CircleThread";
import { ThreadView } from "@/components/messages/ThreadView";

type Params = Promise<{ id: string }>;

export async function generateStaticParams() {
  const list = await getThreads();
  return list.map((t) => ({ id: t.id }));
}

export default async function ThreadPage({ params }: { params: Params }) {
  const { id } = await params;

  // Circles are created in the browser, so the server has never heard of them.
  // Anything that isn't a seeded thread is handed to the client to resolve.
  const thread = await getThread(id);
  if (!thread) return <CircleThread id={id} />;

  return <ThreadView id={id} />;
}
