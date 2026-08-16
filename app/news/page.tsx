import type { Metadata } from "next";
import NewsGallery from "./NewsGallery";

export const metadata: Metadata = {
  title: "News | NEXMOD",
  description: "Project updates, thinking and delivery news from NEXMOD.",
};

export default function NewsPage() {
  return <NewsGallery />;
}
