import { Suspense } from "react";
import { BoardFromUrl, BoardPage } from "@/agent-kernel/pages/BoardPage";

/** The board stays mounted while a card's drawer opens and closes over it. */
export default function BoardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<BoardPage agent={null}>{children}</BoardPage>}>
      <BoardFromUrl>{children}</BoardFromUrl>
    </Suspense>
  );
}
