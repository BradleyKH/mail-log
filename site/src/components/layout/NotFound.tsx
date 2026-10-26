import { Link, useLocation } from "react-router";
import PagePlaceholder from "./PagePlaceholder";

export default function NotFound() {
  const { pathname } = useLocation();
  return (
    <PagePlaceholder title="Record not found" summary="THERE ARE 0 DOCUMENTS AT THIS ADDRESS.">
      <p>{pathname}</p>
      <Link to="/" className="text-primary underline">
        Return to the main menu
      </Link>
    </PagePlaceholder>
  );
}
