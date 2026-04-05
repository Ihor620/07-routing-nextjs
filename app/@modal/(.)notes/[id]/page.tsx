import { fetchNoteById } from "@/lib/api";
import ModalIntercepted from "./NotePreview.client";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function InterceptedNotePage({ params }: Props) {
  const { id } = await params;
  const note = await fetchNoteById(id);

  return <ModalIntercepted note={note} />;
}