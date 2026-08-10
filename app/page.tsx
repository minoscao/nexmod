import type { Metadata } from "next";
import SiteExperience from "./SiteExperience";

export const metadata: Metadata = {
  title: "NEXMOD | Modular Buildings for Australian Projects",
  description: "NEXMOD delivers integrated modular building solutions for Australian commercial, education, healthcare, accommodation and industrial projects.",
};

export default function Home() {
  return <SiteExperience />;
}
