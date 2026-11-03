import DedicationBlock from "./DedicationBlock";
import HomeSections from "./HomeSections";
import HomeHero from "./HomeHero";
import HomeIntro from "./HomeIntro";
import HomeStats from "./HomeStats";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <HomeHero />
      <HomeStats />
      <HomeIntro />
      <HomeSections />
      <DedicationBlock />
    </div>
  );
}
