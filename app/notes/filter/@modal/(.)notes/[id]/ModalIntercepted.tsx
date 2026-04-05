"use client";

import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import NotePreview from "@/components/NotePreview/NotePreview";
import type { Note } from "@/types/note";

interface Props {
  note: Note;
}

export default function ModalIntercepted({ note }: Props) {
  const router = useRouter();

  return (
    <Modal onClose={() => router.back()}>
      <NotePreview note={note} />
    </Modal>
  );
}
