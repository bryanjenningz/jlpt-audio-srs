import { KeyboardArrowLeftIcon } from "~/icons/keyboard-arrow-left-icon";
import { KeyboardArrowRightIcon } from "~/icons/keyboard-arrow-right-icon";
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

  console.log({ wordsLength });

  if (wordsLength === 0) {
    <></>;
  }

  return (
    <div className="flex w-full items-center justify-between">
      <button
        className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 disabled:bg-slate-900"
        disabled={page <= 0}
        onClick={() => decrementPage(level)}
        title="Previous page"
      >
        <KeyboardArrowLeftIcon />
      </button>
      {`${page * WORDS_PER_PAGE + 1} - ${Math.min(
        wordsLength,
        (page + 1) * WORDS_PER_PAGE,
      )}`}
      <button
        className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 disabled:bg-slate-900"
        disabled={(page + 1) * WORDS_PER_PAGE >= wordsLength}
        onClick={() => incrementPage(level)}
        title="Next page"
      >
        <KeyboardArrowRightIcon />
      </button>
    </div>
  );
}
