"use client";

import { useState } from "react";
import { useQuery, HydrationBoundary } from "@tanstack/react-query";
import type { DehydratedState } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes } from "../../lib/api";
import NoteList from "../../components/NoteList/NoteList";
import Pagination from "../../components/Pagination/Pagination";
import SearchBox from "../../components/SearchBox/SearchBox";
import Modal from "../../components/Modal/Modal";
import NoteForm from "../../components/NoteForm/NoteForm";
import type { Note } from "../../types/note";
import css from "./NotesPage.module.css";

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

interface NotesClientProps {
  dehydratedState: DehydratedState;
}

export default function NotesClient({ dehydratedState }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesContent
        page={page}
        search={search}
        isOpen={isOpen}
        setPage={setPage}
        setIsOpen={setIsOpen}
        debouncedSearch={debouncedSearch}
      />
    </HydrationBoundary>
  );
}

interface NotesContentProps {
  page: number;
  search: string;
  isOpen: boolean;
  setPage: (page: number) => void;
  setIsOpen: (open: boolean) => void;
  debouncedSearch: (value: string) => void;
}

function NotesContent({
  page,
  search,
  isOpen,
  setPage,
  setIsOpen,
  debouncedSearch,
}: NotesContentProps) {
  const { data, isLoading, isError } = useQuery<NotesResponse>({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes(page, search),
    staleTime: 500,
    placeholderData: (prev) => prev,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError) return <p>Could not fetch the list of notes.</p>;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={debouncedSearch} />
        {(data?.totalPages ?? 0) > 1 && (
          <Pagination
            pageCount={data?.totalPages ?? 1}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <button className={css.button} onClick={() => setIsOpen(true)}>
          Create note +
        </button>
      </header>

      <NoteList notes={data?.notes ?? []} />

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <NoteForm onClose={() => setIsOpen(false)} />
        </Modal>
      )}
    </div>
  );
}