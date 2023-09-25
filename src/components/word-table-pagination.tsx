import { useStore } from "~/stores/use-store";
import {
  DEFAULT_PAGE,
  WORDS_PER_PAGE,
  useWordTablePaginationStore,
} from "~/stores/word-table-pagination-store";
import { useLevel } from "~/utils/levels";
import { useWords } from "~/words/hooks";

export function WordTablePagination() {
  const level = useLevel();
  const [words] = useWords(level);
  const wordsLength = words.length;
  const page =
    useStore(useWordTablePaginationStore, (x) => x.page[level]) ??
    DEFAULT_PAGE[level];
  const decrementPage = useWordTablePaginationStore((x) => x.decrementPage);
  const incrementPage = useWordTablePaginationStore((x) => x.incrementPage);

  return (
    <div className="flex w-full items-center justify-between">
      <button
        className="h-10 w-10 rounded-full bg-slate-700"
        disabled={page <= 0}
        onClick={() => decrementPage(level)}
      >
        {`<`}
      </button>
      {`${page * WORDS_PER_PAGE + 1} - ${Math.min(
        wordsLength,
        (page + 1) * WORDS_PER_PAGE,
      )}`}
      <button
        className="h-10 w-10 rounded-full bg-slate-700"
        disabled={(page + 1) * WORDS_PER_PAGE >= wordsLength}
        onClick={() => incrementPage(level)}
      >
        {`>`}
      </button>
    </div>
  );
}
