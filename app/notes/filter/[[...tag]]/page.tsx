import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "../../../../lib/api";
import NotesFilterClient from "./NotesFilter.client";

interface PageProps {
  params: Promise<{ tag?: string[] }>;
}

export const dynamic = "force-dynamic";

export default async function FilterPage({ params }: PageProps) {
  const { tag } = await params;

  const tagValue = tag?.[0];

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