import { Navigate, useParams } from "react-router";
import { getDoc, getSections } from "@/content/load";

export default function SectionRedirectPage() {
  const { docId = "", sectionId = "" } = useParams();
  const doc = getDoc(docId);
  if (!doc) return <Navigate to="/archive" replace />;
  const section = getSections(doc.docId).find((s) => s.id === sectionId);
  return <Navigate to={section ? `/archive/${doc.docId}/page/${section.pdfPage}` : `/archive/${doc.docId}`} replace />;
}
