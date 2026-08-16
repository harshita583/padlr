import { getThreads } from "@/lib/data";
import { ThreadView } from "@/components/messages/ThreadView";

type Params = Promise<{ id: string }>;

export async function generateStaticParams() {
  const list = await getThreads();
  return list.map((t) => ({ id: t.id }));
}

export default async function ThreadPage({ params }: { params: Params }) {
  const { id } = await params;
  return <ThreadView id={id} />;
}
