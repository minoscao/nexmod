import { desc } from "drizzle-orm";
import { getDb } from "../db";
import { newsItems } from "../db/schema";
import { defaultNews } from "./news-content";

export async function ensureNewsSeed() {
  const db = getDb();
  const [existing] = await db.select({ id: newsItems.id }).from(newsItems).limit(1);
  if (existing) return;

  await db.insert(newsItems).values(defaultNews.map((item) => ({
    title: item.title,
    category: item.category,
    publishedAt: item.publishedAt ?? item.date ?? "",
    summary: item.summary ?? "",
    imageUrl: item.image ?? "",
  })));
}

export async function listNews() {
  await ensureNewsSeed();
  return getDb().select().from(newsItems).orderBy(desc(newsItems.publishedAt), desc(newsItems.id)).limit(24);
}
