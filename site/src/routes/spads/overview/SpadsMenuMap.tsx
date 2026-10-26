import { useEffect, useState } from "react";
import { Link } from "react-router";
import { spadsMenus } from "@/content/load";
import { pagePath } from "@/routes/archive/scanUrl";
import { highlightedOptions, menuDocs, parseMainMenu, VOLUME_LABEL, type MenuOption } from "./overviewData";

export default function SpadsMenuMap() {
  const [options, setOptions] = useState<MenuOption[]>([]);

  useEffect(() => {
    let live = true;
    spadsMenus().then((menus) => {
      const main = menus?.spadsMain;
      if (live && Array.isArray(main)) setOptions(parseMainMenu(main));
    });
    return () => {
      live = false;
    };
  }, []);

  return (
    <div className="space-y-3">
      <h3 className="font-mono text-sm font-semibold tracking-wide uppercase">The SPADS Main Menu</h3>
      <p className="text-sm text-muted-foreground">
        Each option opens a program; the volume and section that document it are linked.
      </p>
      <ul className="grid gap-2 sm:grid-cols-2" aria-label="SPADS Main Menu options">
        {options.map(({ n, label }) => {
          const doc = menuDocs[n];
          const highlight = highlightedOptions[n];
          return (
            <li
              key={n}
              data-highlight={highlight ? "true" : undefined}
              className={`rounded-md border p-3 text-sm ${highlight ? "border-primary bg-accent" : "bg-card"}`}
            >
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-mono font-semibold">({n})</span>
                <span>{label}</span>
                {highlight && (
                  <span className="rounded bg-primary px-1.5 py-0.5 font-mono text-xs text-primary-foreground">{highlight}</span>
                )}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {doc ? (
                  <>
                    <Link to={`/archive/${doc.docId}/section/${doc.sectionId}`} className="underline underline-offset-4">
                      {`${VOLUME_LABEL[doc.docId]} section ${doc.sectionId}`}
                    </Link>
                    {", "}
                    <Link to={pagePath(doc.docId, doc.pdfPage)} className="underline underline-offset-4">
                      {`p. ${doc.pdfPage}`}
                    </Link>
                  </>
                ) : (
                  "Listed on the menu; no section in the three manuals"
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
