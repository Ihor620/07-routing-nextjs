import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesFilterClient from "./Notes.client";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export const dynamic = "force-dynamic";

export default async function FilterPage({ params }: PageProps) {
  const { slug } = await params;

  const tagValue = slug?.[0];
  const activeTag =
    !tagValue || tagValue === "all" ? undefined : tagValue;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", activeTag],
    queryFn: () => fetchNotes(1, "", activeTag),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesFilterClient activeTag={activeTag} />
    </HydrationBoundary>
  );
}