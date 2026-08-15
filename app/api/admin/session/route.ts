import { requireAdminSession } from "../../../../lib/admin";

export async function GET() {
  return Response.json({ authenticated: await requireAdminSession() });
}
