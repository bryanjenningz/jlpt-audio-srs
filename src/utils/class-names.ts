export function classNames(...classes: (string | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
