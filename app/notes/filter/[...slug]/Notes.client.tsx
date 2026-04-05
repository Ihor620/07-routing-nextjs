"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import css from "./NotesFilter.module.css";

interface Props {
  activeTag?: string;
}

export default function NotesFilterClient({ activeTag }: Props) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", 1, "", activeTag],
    queryFn: () => fetchNotes(1, "", activeTag),
    staleTime: 500,
    placeholderData: (prev) => prev,
  });

  if (isLoading) return <p className={css.message}>Loading notes...</p>;
  if (isError) return <p className={css.message}>Failed to load notes.</p>;
  if (!data?.notes.length)
    return <p className={css.message}>No notes found.</p>;

  return <NoteList notes={data.notes} />;
}