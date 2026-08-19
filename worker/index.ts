/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  EMAIL?: {
    send(message: {
      from: string;
      to: string;
      replyTo?: string;
      subject: string;
      text: string;
      html: string;
    }): Promise<unknown>;
  };
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const CONTACT_RECIPIENT = "info@nexmod.com.au";
const CONTACT_SENDER = "website@nexmod.com.au";

function json(data: Record<string, unknown>, status = 200): Response {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

function cleanText(value: unknown, limit: number): string {
  return typeof value === "string" ? value.trim().replace(/\u0000/g, "").slice(0, limit) : "";
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}

async function handleContact(request: Request, env: Env): Promise<Response> {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json() as Record<string, unknown>;
  } catch {
    return json({ error: "Please complete the form and try again." }, 400);
  }

  const name = cleanText(payload.name, 120);
  const organisation = cleanText(payload.organisation, 160);
  const email = cleanText(payload.email, 254);
  const project = cleanText(payload.project, 4000);
  if (!name || !project || !/^\S+@\S+\.\S+$/.test(email)) {
    return json({ error: "Please complete the required fields and check your email address." }, 400);
  }

  if (!env.EMAIL) {
    return json({ error: "Enquiry delivery is being configured. Please email info@nexmod.com.au directly." }, 503);
  }

  const text = [
    "New NEXMOD website enquiry",
    "",
    `Name: ${name}`,
    `Organisation: ${organisation || "Not supplied"}`,
    `Email: ${email}`,
    "",
    "Project:",
    project,
  ].join("\n");

  try {
    await env.EMAIL.send({
      from: CONTACT_SENDER,
      to: CONTACT_RECIPIENT,
      replyTo: email,
      subject: `NEXMOD website enquiry — ${name}`,
      text,
      html: `<h2>New NEXMOD website enquiry</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Organisation:</strong> ${escapeHtml(organisation || "Not supplied")}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Project:</strong><br>${escapeHtml(project).replace(/\n/g, "<br>")}</p>`,
    });
  } catch {
    return json({ error: "We could not send your enquiry just now. Please email info@nexmod.com.au directly." }, 502);
  }

  return json({ ok: true });
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact" && request.method === "POST") {
      return handleContact(request, env);
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
