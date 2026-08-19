import { getDb } from "../../../../db";
import { newsMedia } from "../../../../db/schema";
import { requireAdminSession } from "../../../../lib/admin";

const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function toBase64(bytes: ArrayBuffer) {
  const values = new Uint8Array(bytes);
  let binary = "";
  for (const value of values) binary += String.fromCharCode(value);
  return btoa(binary);
}

export async function POST(request: Request) {
  if (!await requireAdminSession()) return Response.json({ error: "Unauthorised" }, { status: 401 });
  const data = await request.formData();
  const file = data.get("image");
  if (!(file instanceof File) || !allowedTypes.has(file.type)) return Response.json({ error: "Use a JPG, PNG or WebP image." }, { status: 400 });
  if (file.size > MAX_IMAGE_BYTES) return Response.json({ error: "Images must be smaller than 3 MB." }, { status: 400 });

  const id = crypto.randomUUID();
  await getDb().insert(newsMedia).values({ id, contentType: file.type, content: toBase64(await file.arrayBuffer()) });
  return Response.json({ imageUrl: `/api/news/image/${id}` }, { status: 201 });
}
