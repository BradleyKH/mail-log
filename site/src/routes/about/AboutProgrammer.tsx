import AboutSection from "./AboutSection";
import PullQuote from "./PullQuote";

export default function AboutProgrammer() {
  return (
    <AboutSection title="The programmer">
      <p>
        Danny K. Harris is a West Virginia native with a math degree from Concord College and a master&apos;s in math from West Virginia
        University. He taught school, first in West Virginia and then for five years in Hampton Roads, Virginia, before going to work at
        NASA&apos;s Langley Research Center in 1978 as a programmer for the Scout rocket program.
      </p>
      <p>
        Scout was a four-stage rocket that sent small payloads into space. Danny was involved in launch management, and, as the
        Charleston Gazette-Mail reported in 2001, he tied the two U.S.-based launch sites into a single computer system, something that
        had not been attempted before. He spent 11 years with NASA in all.
      </p>
      <PullQuote>Every time there was a successful launch, it was a sense of pride you shared with everyone.</PullQuote>
      <p>
        After seminary in Texas he returned to NASA in 1994 as a consultant, responsible for archiving the Scout program&apos;s
        database. He compiled the program&apos;s information from 1961 to 1993 onto compact discs. In 1995 he moved back to West
        Virginia to pursue his first love, teaching, and he went on to teach computer science and math at Herbert Hoover High School.
      </p>
      <PullQuote>I was the last guy out the door turning off the lights.</PullQuote>
      <PullQuote>I&apos;m a West Virginia guy that worked for NASA and you can do that, too.</PullQuote>
    </AboutSection>
  );
}
