import AboutSection from "./AboutSection";

export default function AboutHowMade() {
  return (
    <AboutSection title="How this site was made">
      <p>
        Every page of the four 1979 reports was scanned, and its text recognized by machine. The recognized FORTRAN listings were repaired
        line by line, and the pages where recognition was least certain were reviewed against the scans. Each page on the site shows its
        scan beside its text, so the original is always one glance away. The Terminal follows the operating instructions&apos; own step
        logic, and the Code and Map rooms are built from the printed listings and flowcharts.
      </p>
      <p>
        The 1985 manuals are typed text and read well by machine. The printed appendix reports at the back of Volume II, the sample
        printouts of the financial program, were too dense for that, so an AI model transcribed them from page renders. Every
        transcribed total was then checked by arithmetic against the printout&apos;s own figures, and the pages carry a badge marking
        them as AI transcriptions. Where the manuals state no formula, the site reconstructs it from the printed rows and labels it as
        a reconstruction, with the rows it reproduces.
      </p>
    </AboutSection>
  );
}
