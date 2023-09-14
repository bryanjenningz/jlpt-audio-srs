import { classNames } from "~/utils/class-names";

export function AutoplayButton({
  autoplay,
  setAutoplay,
}: {
  autoplay: boolean;
  setAutoplay: (updateAutoplay: (autoplay: boolean) => boolean) => void;
}) {
  return (
    <label
      className={classNames(
        "flex w-full cursor-pointer justify-center rounded-full px-4 py-2 text-lg",
        autoplay ? "bg-blue-700" : "bg-slate-700",
      )}
    >
      {autoplay ? `Autoplaying` : `Autoplay`}
      <input
        className="hidden"
        type="checkbox"
        checked={autoplay}
        onChange={() => setAutoplay((autoplay) => !autoplay)}
      />
    </label>
  );
}
