import { DayToNightBackground } from "@/components/DayToNightBackground";
import { Hero } from "@/components/Hero";
import { PupsRun } from "@/components/sections/PupsRun";
import { TwoWaysSignpost } from "@/components/TwoWaysSignpost";
import { JourneyChatPhone } from "@/components/JourneyChatPhone";
import { PassportBook } from "@/components/PassportBook";
import { PolaroidWall } from "@/components/PolaroidWall";
import { QuestionsAnswered } from "@/components/QuestionsAnswered";
import { DoorScene } from "@/components/DoorScene";
import puppiesData from "@/data/puppies.json";
import { Puppy } from "@/lib/types";

export default function Home() {
  const puppies = puppiesData as Puppy[];

  return (
    <DayToNightBackground>
      {/* 1. HERO (cream) - Mascot hops out, drops onto argyle strip */}
      <Hero />

      {/* 2. MEET THE PUPS (cream, argyle top edge) - Pinned running puppy & gateway reveals */}
      <PupsRun puppies={puppies} />

      {/* 3. TWO WAYS TO MEET YOUR PUPPY (tan) - Tall wooden signpost + flying airplane */}
      <TwoWaysSignpost />

      {/* 4. YOUR PUPPY JOURNEY (tan to caramel) - Vertical steps + sticky WhatsApp chatphone */}
      <JourneyChatPhone />

      {/* 5. WHY FAMILIES TRUST PUPPYNEST (caramel) - Open passport book with slamming stamps */}
      <PassportBook />

      {/* 6. HAPPY FAMILIES & PUPPIES (caramel brown, wooden wall) - 8 taped polaroids + street lamp */}
      <PolaroidWall />

      {/* 7. QUESTIONS, ANSWERED (night) - Night sky with stars, sitting mascot, 3 expanded Q&As */}
      <QuestionsAnswered />

      {/* 8. READY TO MEET YOUR NEW BEST FRIEND (night) - Cozy home scene with arched door swinging open */}
      <DoorScene />
    </DayToNightBackground>
  );
}
