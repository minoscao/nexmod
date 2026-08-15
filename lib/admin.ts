import { and, eq, gt } from "drizzle-orm";
import { cookies } from "next/headers";
import { env } from "cloudflare:workers";
import { getDb } from "../db";
import { adminSessions } from "../db/schema";

const COOKIE_NAME = "nexmod_admin";
const SESSION_DAYS = 7;

export function configuredAdminCredentials() {
  return { username: env.ADMIN_USERNAME as string | undefined, password: env.ADMIN_PASSWORD as string | undefined };
}

export async function createAdminSession() {
  const id = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  const db = getDb();
  await db.insert(adminSessions).values({ id, expiresAt: expiresAt.toISOString() });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, id, { httpOnly: true, secure: true, sameSite: "lax", path: "/", expires: expiresAt });
}

export async function requireAdminSession() {
  const cookieStore = await cookies();
  const id = cookieStore.get(COOKIE_NAME)?.value;
  if (!id) return false;
  const db = getDb();
  const [session] = await db.select({ id: adminSessions.id }).from(adminSessions).where(and(eq(adminSessions.id, id), gt(adminSessions.expiresAt, new Date().toISOString()))).limit(1);
  return Boolean(session);
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  const id = cookieStore.get(COOKIE_NAME)?.value;
  if (id) await getDb().delete(adminSessions).where(eq(adminSessions.id, id));
  cookieStore.set(COOKIE_NAME, "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });
}
