import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("renders the NEXMOD modular development site", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /NEXMOD \| Modular Development\. Redefined\./);
  assert.match(html, /Modular development\. Redefined\./);
  assert.match(html, /Melbourne/);
  assert.match(html, /Shenzhen/);
  assert.match(html, /Design &amp; innovation/);
  assert.match(html, /South Melbourne, VIC/);
  assert.match(html, /Western Australia/);
  assert.match(html, /Our people/i);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site|react-loading-skeleton/i);
});
