import { Link } from "react-router";

export type Crumb = { label: string; to?: string };

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-x-2">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-x-2">
            {i > 0 && <span aria-hidden>/</span>}
            {c.to ? (
              <Link to={c.to} className="underline-offset-2 hover:text-foreground hover:underline">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-foreground">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
