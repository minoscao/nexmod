import { createAdminSession, configuredAdminCredentials } from "../../../../lib/admin";

export async function POST(request: Request) {
  const body = await request.json() as { username?: string; password?: string };
  const { username, password } = configuredAdminCredentials();
  if (!username || !password) return Response.json({ error: "Admin access is not configured." }, { status: 503 });
  if (body.username !== username || body.password !== password) return Response.json({ error: "Incorrect username or password." }, { status: 401 });
  await createAdminSession();
  return Response.json({ ok: true });
}
