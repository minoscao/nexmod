"use client";

import { FormEvent, useEffect, useState } from "react";

type NewsItem = { id: number; title: string; category: string; publishedAt: string; summary: string };
const emptyForm = { id: 0, title: "", category: "Company news", publishedAt: "", summary: "" };

export default function AdminConsole() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [items, setItems] = useState<NewsItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  async function loadNews() {
    const response = await fetch("/api/news");
    const data = await response.json();
    if (response.ok) setItems(data.items);
    else setMessage(data.error || "News could not be loaded.");
  }
  useEffect(() => { fetch("/api/admin/session").then((r) => r.json()).then((data) => { setAuthenticated(Boolean(data.authenticated)); if (data.authenticated) loadNews(); }).catch(() => setAuthenticated(false)); }, []);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage("");
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(credentials) });
    const data = await response.json();
    if (!response.ok) { setMessage(data.error || "Unable to sign in."); return; }
    setAuthenticated(true); await loadNews();
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage("");
    const method = form.id ? "PUT" : "POST";
    const response = await fetch("/api/news", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await response.json();
    if (!response.ok) { setMessage(data.error || "Unable to save the news item."); return; }
    setForm(emptyForm); setMessage("News item saved."); await loadNews();
  }
  async function remove(id: number) {
    if (!window.confirm("Delete this news item?")) return;
    const response = await fetch(`/api/news?id=${id}`, { method: "DELETE" });
    if (response.ok) { setForm(emptyForm); setMessage("News item deleted."); await loadNews(); }
  }
  async function logout() { await fetch("/api/admin/logout", { method: "POST" }); setAuthenticated(false); setForm(emptyForm); setMessage(""); }

  if (authenticated === null) return <main className="admin-shell"><p>Checking secure access…</p></main>;
  if (!authenticated) return <main className="admin-shell"><a className="admin-logo" href="/"><img src="/assets/nexmod-logo-final.png" alt="NEXMOD" /></a><section className="admin-login"><p className="eyebrow">Secure administration</p><h1>News administration</h1><p>Sign in to publish, edit or remove news visible on the NEXMOD website.</p><form onSubmit={login}><label>Username<input value={credentials.username} onChange={(event) => setCredentials({ ...credentials, username: event.target.value })} autoComplete="username" required /></label><label>Password<input type="password" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} autoComplete="current-password" required /></label><button className="button button-primary" type="submit">Sign in</button>{message ? <p className="admin-message is-error">{message}</p> : null}</form></section></main>;
  return <main className="admin-shell"><header className="admin-header"><a className="admin-logo" href="/"><img src="/assets/nexmod-logo-final.png" alt="NEXMOD" /></a><div><a href="/">View website</a><button onClick={logout}>Sign out</button></div></header><section className="admin-content"><div className="admin-intro"><p className="eyebrow">Admin / News</p><h1>Publish news</h1><p>Every saved item is immediately available to the public News section.</p></div><div className="admin-grid"><form className="admin-editor" onSubmit={save}><p className="admin-form-label">{form.id ? "Edit news item" : "New news item"}</p><label>Title<input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></label><label>Category<input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} required /></label><label>Publication date<input value={form.publishedAt} onChange={(event) => setForm({ ...form, publishedAt: event.target.value })} placeholder="e.g. August 2026" required /></label><label>Summary<textarea rows={5} value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} /></label><div className="admin-actions"><button className="button button-primary" type="submit">{form.id ? "Save changes" : "Publish news"}</button>{form.id ? <button className="admin-reset" type="button" onClick={() => setForm(emptyForm)}>Cancel</button> : null}</div>{message ? <p className="admin-message">{message}</p> : null}</form><div className="admin-list"><p className="admin-form-label">Published items</p>{items.length ? items.map((item) => <article key={item.id}><p>{item.publishedAt} / {item.category}</p><h2>{item.title}</h2><span>{item.summary}</span><div><button onClick={() => setForm(item)}>Edit</button><button className="admin-delete" onClick={() => remove(item.id)}>Delete</button></div></article>) : <p className="admin-empty">No published items yet. Use the form to create the first one.</p>}</div></div></section></main>;
}
