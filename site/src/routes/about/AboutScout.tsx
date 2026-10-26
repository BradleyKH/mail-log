import { Link } from "react-router";
import AboutSection from "./AboutSection";

export default function AboutScout() {
  return (
    <AboutSection title="MAGSAT in the sample data">
      <p>
        The manual&apos;s sample records were dated in the fall of 1978, and several are about MAGSAT, a NASA and U.S. Geological Survey
        satellite built to map the Earth&apos;s magnetic field: a MAGSAT range service purchase request, a MAGSAT heatshield clearance,
        and a MAGSAT spacecraft task plan. MAGSAT was launched on a NASA Scout rocket from Vandenberg Air Force Base on October 30,
        1979, about five months after these reports were written, according to the{" "}
        <a
          href="https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1979-094A"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4"
        >
          NASA Space Science Data Coordinated Archive
        </a>
        . Try the{" "}
        <Link to="/archive?q=MAGSAT" className="underline underline-offset-4">
          Archive search for MAGSAT
        </Link>
        .
      </p>
    </AboutSection>
  );
}
