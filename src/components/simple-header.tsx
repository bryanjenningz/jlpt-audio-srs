import { MenuIcon } from "~/icons/menu-icon";

export function SimpleHeader({
  openSideMenu,
  title,
}: {
  openSideMenu: () => void;
  title: string;
}) {
  return (
    <header className="flex w-full justify-center bg-black text-white shadow">
      <div className="w-full max-w-2xl">
        <section className="flex h-14 items-center">
          <button className="h-full px-4" onClick={openSideMenu}>
            <span className="sr-only">Open side menu</span>
            <MenuIcon />
          </button>

          <div className="relative flex grow">
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
        </section>
      </div>
    </header>
  );
}
