export type NewsItem = {
  id?: number;
  date?: string;
  publishedAt?: string;
  category: string;
  title: string;
  summary?: string;
  image?: string;
};

export const newsImages = [
  "/assets/news-south-melbourne.png",
  "/assets/news-design-review.png",
  "/assets/news-manufacturing.png",
  "/assets/news-wa-regional.png",
  "/assets/news-materials.png",
  "/assets/news-whole-room.png",
];

export const defaultNews: NewsItem[] = [
  { date: "August 2026", category: "Project update", title: "South Melbourne modular living enters design development.", summary: "A whole-room residential brief shaped around daylight, materiality and a compact city footprint.", image: newsImages[0] },
  { date: "July 2026", category: "Design & innovation", title: "A modular brief starts with the room, not the component.", summary: "Our design process aligns user needs, coordination and buildability from the first decision.", image: newsImages[1] },
  { date: "June 2026", category: "Manufacturing", title: "Precision manufacturing is planned before the line begins.", summary: "Product development and delivery thinking are connected early for certainty and quality.", image: newsImages[2] },
  { date: "May 2026", category: "Project update", title: "A regional Western Australia accommodation study progresses.", summary: "A durable, repeatable response designed for place, programme and long-term performance.", image: newsImages[3] },
  { date: "April 2026", category: "Procurement", title: "Material decisions that make modular delivery more certain.", summary: "Procurement is brought forward to protect quality, cost and programme outcomes.", image: newsImages[4] },
  { date: "March 2026", category: "Perspective", title: "Complete spaces ask for a more connected delivery system.", summary: "Modular buildings work best when development, design and supply are considered together.", image: newsImages[5] },
];

export function withNewsImages(items: NewsItem[]) {
  return items.map((item, index) => ({ ...item, image: item.image || newsImages[index % newsImages.length] }));
}
