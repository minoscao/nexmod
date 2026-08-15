import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { newsItems } from "../../../db/schema";
import { requireAdminSession } from "../../../lib/admin";

function message(error: unknown) { return error instanceof Error ? error.message : "Unexpected error"; }
async function isAdmin() { return requireAdminSession(); }

export async function GET() {
  try { return Response.json({ items: await getDb().select().from(newsItems).orderBy(desc(newsItems.publishedAt), desc(newsItems.id)).limit(12) }); }
  catch (error) { return Response.json({ error: message(error) }, { status: 500 }); }
}

export async function POST(request: Request) {
  if (!await isAdmin()) return Response.json({ error: "Unauthorised" }, { status: 401 });
  const body = await request.json() as Partial<typeof newsItems.$inferInsert>;
  if (!body.title?.trim() || !body.publishedAt?.trim()) return Response.json({ error: "Title and publication date are required." }, { status: 400 });
  const [item] = await getDb().insert(newsItems).values({ title: body.title.trim(), category: body.category?.trim() || "Company news", publishedAt: body.publishedAt.trim(), summary: body.summary?.trim() || "" }).returning();
  return Response.json({ item }, { status: 201 });
}

export async function PUT(request: Request) {
  if (!await isAdmin()) return Response.json({ error: "Unauthorised" }, { status: 401 });
  const body = await request.json() as Partial<typeof newsItems.$inferInsert> & { id?: number };
  if (!body.id || !body.title?.trim() || !body.publishedAt?.trim()) return Response.json({ error: "ID, title and publication date are required." }, { status: 400 });
  const [item] = await getDb().update(newsItems).set({ title: body.title.trim(), category: body.category?.trim() || "Company news", publishedAt: body.publishedAt.trim(), summary: body.summary?.trim() || "", updatedAt: new Date().toISOString() }).where(eq(newsItems.id, body.id)).returning();
  return Response.json({ item });
}

export async function DELETE(request: Request) {
  if (!await isAdmin()) return Response.json({ error: "Unauthorised" }, { status: 401 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id)) return Response.json({ error: "A valid ID is required." }, { status: 400 });
  await getDb().delete(newsItems).where(eq(newsItems.id, id));
  return Response.json({ ok: true });
}
