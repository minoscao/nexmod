import type { Metadata } from "next";
import SiteExperience from "./SiteExperience";

export const metadata: Metadata = {
  title: "NEXMOD | Modular Development. Redefined.",
  description: "Integrated modular development, design and procurement for complete modular buildings across Australia and international delivery networks.",
};

export default function Home() {
  return <SiteExperience />;
}
