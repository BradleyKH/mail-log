import { Link } from "react-router";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeaderSearchLink() {
  return (
    <Button asChild variant="ghost" size="icon">
      <Link to="/archive" state={{ focusSearch: true }} aria-label="Search the reports (press /)" title="Search the reports (press /)">
        <Search />
      </Link>
    </Button>
  );
}
