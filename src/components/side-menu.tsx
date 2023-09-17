import Link from "next/link";
import { useRouter } from "next/router";
import { classNames } from "~/utils/class-names";

type SideMenuOptionGroup = {
  label: string;
  options: SideMenuOption[];
};

type SideMenuOption = {
  label: string;
  href: string;
  matches?: boolean;
};

export const SideMenu = ({
  isSideMenuOpen,
  closeSideMenu,
}: {
  isSideMenuOpen: boolean;
  closeSideMenu: () => void;
}) => {
  const router = useRouter();

  const sideMenuOptionGroups: SideMenuOptionGroup[] = [
    {
      label: "Learn / review",
      options: [
        {
          label: "JLPT 5 SRS",
          href: "/learn/5",
          matches:
            router.pathname === "/learn/[level]" && router.query.level === "5",
        },
        {
          label: "JLPT 4 SRS",
          href: "/learn/4",
          matches:
            router.pathname === "/learn/[level]" && router.query.level === "4",
        },
      ],
    },
    {
      label: "Word lists",
      options: [
        {
          label: "JLPT 5 Words",
          href: "/words/5",
          matches:
            router.pathname === "/words/[level]" && router.query.level === "5",
        },
        {
          label: "JLPT 4 Words",
          href: "/words/4",
          matches:
            router.pathname === "/words/[level]" && router.query.level === "4",
        },
      ],
    },
  ];

  return (
    <>
      <div
        className={classNames(
          "fixed inset-0 z-10 bg-black opacity-40",
          !isSideMenuOpen && "hidden",
        )}
        onClick={closeSideMenu}
      ></div>

      <aside
        className={classNames(
          "fixed bottom-0 top-0 z-10 min-w-[200px] bg-black text-white transition-[left] duration-300",
          isSideMenuOpen ? "left-0" : "-left-64",
        )}
        aria-hidden={!isSideMenuOpen}
      >
        <h1 className="flex w-full items-center justify-center bg-black py-4 text-white">
          JLPT Audio SRS
        </h1>

        {sideMenuOptionGroups.map(({ label, options }) => {
          return (
            <section key={label}>
              <h2 className="bg-slate-900 px-4 py-2 text-xs uppercase">
                {label}
              </h2>

              <ul>
                {options.map((option) => {
                  const key = `${label}-${option.label}`;
                  return (
                    <li key={key}>
                      <Link
                        className={classNames(
                          "flex w-full items-center gap-2 px-4 py-2 text-left text-lg",
                          (router.pathname === option.href ||
                            !!option.matches) &&
                            "bg-blue-900 text-white",
                        )}
                        href={option.href}
                      >
                        {option.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </aside>
    </>
  );
};
