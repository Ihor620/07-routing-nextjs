import { ReactNode } from "react";
import css from "./layout.module.css";

interface FilterLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  modal: ReactNode;
}

export default function FilterLayout({
  children,
  sidebar,
  modal,
}: FilterLayoutProps) {
  return (
    <div className={css.layout}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <main className={css.main}>{children}</main>
      {modal}
    </div>
  );
}