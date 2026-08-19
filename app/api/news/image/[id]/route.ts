import { eq } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { newsMedia } from "../../../../../db/schema";

function fromBase64(value: string) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const [media] = await getDb().select().from(newsMedia).where(eq(newsMedia.id, id)).limit(1);
  if (!media) return new Response("Not found", { status: 404 });
  return new Response(fromBase64(media.content), { headers: { "Content-Type": media.contentType, "Cache-Control": "public, max-age=31536000, immutable" } });
}
