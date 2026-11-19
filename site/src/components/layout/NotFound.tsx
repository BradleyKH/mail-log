import { Link, useLocation } from "react-router";

export default function NotFound() {
  const { pathname } = useLocation();
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-mono text-3xl font-semibold tracking-wide uppercase">Record not found</h1>
        <p className="text-muted-foreground">THERE ARE 0 DOCUMENTS AT THIS ADDRESS.</p>
      </header>
      <p className="font-mono text-sm break-all text-muted-foreground">{pathname}</p>
      <Link to="/" className="font-mono text-sm text-primary underline">
        Return to the main menu
      </Link>
    </section>
  );
}
