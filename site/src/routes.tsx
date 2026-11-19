import { lazy } from "react";
import { Route, Routes } from "react-router";
import SiteLayout from "@/components/layout/SiteLayout";
import NotFound from "@/components/layout/NotFound";

const HomePage = lazy(() => import("./routes/home/HomePage"));
const AboutPage = lazy(() => import("./routes/about/AboutPage"));
const GlossaryPage = lazy(() => import("./routes/glossary/GlossaryPage"));
const ArchivePage = lazy(() => import("./routes/archive/ArchivePage"));
const DocumentPage = lazy(() => import("./routes/archive/DocumentPage"));
const PageViewPage = lazy(() => import("./routes/archive/PageViewPage"));
const SectionRedirectPage = lazy(() => import("./routes/archive/SectionRedirectPage"));
const LegacyArchiveRedirect = lazy(() => import("./routes/archive/LegacyArchiveRedirect"));
const TerminalPage = lazy(() => import("./routes/terminal/TerminalPage"));
const CodePage = lazy(() => import("./routes/code/CodePage"));
const RoutinePage = lazy(() => import("./routes/code/RoutinePage"));
const SpadsLayout = lazy(() => import("./routes/spads/SpadsLayout"));
const SpadsOverview = lazy(() => import("./routes/spads/overview/SpadsOverview"));
const MailLog1985 = lazy(() => import("./routes/spads/overview/MailLog1985"));
const ContractTerminalPage = lazy(() => import("./routes/spads/terminal/ContractTerminalPage"));
const SpreadReportsPage = lazy(() => import("./routes/spads/SpreadReportsPage"));
const MapPage = lazy(() => import("./routes/map/MapPage"));

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="glossary" element={<GlossaryPage />} />
        <Route path="reports">
          <Route index element={<ArchivePage />} />
          <Route path=":docId" element={<DocumentPage />} />
          <Route path=":docId/page/:pdfPage" element={<PageViewPage />} />
          <Route path=":docId/section/:sectionId" element={<SectionRedirectPage />} />
        </Route>
        <Route path="archive/*" element={<LegacyArchiveRedirect />} />
        <Route path="terminal" element={<TerminalPage />} />
        <Route path="code">
          <Route index element={<CodePage />} />
          <Route path=":routine" element={<RoutinePage />} />
        </Route>
        <Route path="map" element={<MapPage />} />
        <Route path="spads" element={<SpadsLayout />}>
          <Route index element={<SpadsOverview />} />
          <Route path="mail-log" element={<MailLog1985 />} />
          <Route path="terminal" element={<ContractTerminalPage />} />
          <Route path="spread-reports" element={<SpreadReportsPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
