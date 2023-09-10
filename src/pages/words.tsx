import { useWords } from "~/words/hooks";

export default function Words() {
  const [words, setWords] = useWords();

  return (
    <main className="flex min-h-screen flex-col items-center bg-black text-white">
      <div className="flex w-full max-w-2xl flex-col items-center gap-5 p-5">
        <table className="flex w-full flex-col">
          <thead>
            <tr className="flex w-full max-w-2xl bg-slate-900 p-2 text-lg">
              <th
                className="flex h-full items-center justify-center pr-0"
                title="Skip (already known)"
              >
                <div className="mr-3 text-xl">{`⏩`}</div>
              </th>

              {["Kanji", "Kana", "Definition"].map((col) => {
                return (
                  <th key={col} className="flex grow basis-1 items-center">
                    {col}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="max-h-52 w-full max-w-2xl overflow-auto text-lg">
            {words.map((word) => {
              return (
                <tr
                  key={`${word.kanji}-${word.definition}`}
                  className="flex items-center p-2 odd:bg-slate-800"
                >
                  <input
                    className="mr-3 h-5 w-5"
                    type="checkbox"
                    checked={word.known}
                    onChange={() =>
                      setWords(
                        words.map((w) =>
                          w.order === word.order
                            ? { ...w, known: !w.known }
                            : w,
                        ),
                      )
                    }
                  />

                  <td className="grow basis-1">{word.kanji}</td>
                  <td className="grow basis-1">{word.kana}</td>
                  <td className="grow basis-1">{word.definition}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
