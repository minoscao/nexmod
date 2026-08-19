"use client";

import { FormEvent, useEffect, useState } from "react";

type NewsItem = {
  id: number;
  title: string;
  category: string;
  publishedAt: string;
  summary: string;
  imageUrl: string;
};

const emptyForm: NewsItem = {
  id: 0,
  title: "",
  category: "Company news",
  publishedAt: "",
  summary: "",
  imageUrl: "",
};

export default function AdminConsole() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [items, setItems] = useState<NewsItem[]>([]);
  const [form, setForm] = useState<NewsItem>(emptyForm);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  async function loadNews() {
    const response = await fetch("/api/news");
    const data = await response.json();
    if (response.ok) setItems(data.items);
    else setMessage(data.error || "News could not be loaded.");
  }

  useEffect(() => {
    fetch("/api/admin/session")
      .then((response) => response.json())
      .then((data) => {
        setAuthenticated(Boolean(data.authenticated));
        if (data.authenticated) loadNews();
      })
      .catch(() => setAuthenticated(false));
  }, []);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || "Unable to sign in.");
      return;
    }
    setAuthenticated(true);
    await loadNews();
  }

  async function uploadImage() {
    if (!selectedImage) return form.imageUrl;
    const body = new FormData();
    body.append("image", selectedImage);
    const response = await fetch("/api/news/image", { method: "POST", body });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Image could not be uploaded.");
    return data.imageUrl as string;
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    try {
      const imageUrl = await uploadImage();
      const response = await fetch("/api/news", {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, imageUrl }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save the news item.");
      setForm(emptyForm);
      setSelectedImage(null);
      setIsCreating(false);
      setIsCreatingCategory(false);
      setMessage("News item saved.");
      await loadNews();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save the news item.");
    }
  }

  function beginCreate() {
    setForm(emptyForm);
    setSelectedImage(null);
    setIsCreating(true);
    setIsCreatingCategory(false);
    setMessage("");
  }

  function beginEdit(item: NewsItem) {
    setForm(item);
    setSelectedImage(null);
    setIsCreating(false);
    setIsCreatingCategory(false);
    setMessage("");
  }

  function closeEditor() {
    setForm(emptyForm);
    setSelectedImage(null);
    setIsCreating(false);
    setIsCreatingCategory(false);
  }

  async function remove(id: number) {
    if (!window.confirm("Delete this news item?")) return;
    const response = await fetch(`/api/news?id=${id}`, { method: "DELETE" });
    if (response.ok) {
      closeEditor();
      setMessage("News item deleted.");
      await loadNews();
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    closeEditor();
    setMessage("");
  }

  if (authenticated === null) return <main className="admin-shell"><p>Checking secure access...</p></main>;

  if (!authenticated) {
    return <main className="admin-shell">
      <a className="admin-logo" href="/"><img src="/assets/nexmod-logo-final.png" alt="NEXMOD" /></a>
      <section className="admin-login">
        <p className="eyebrow">Secure administration</p>
        <h1>News administration</h1>
        <p>Sign in to manage the stories visible on the NEXMOD website.</p>
        <form onSubmit={login}>
          <label>Username<input value={credentials.username} onChange={(event) => setCredentials({ ...credentials, username: event.target.value })} autoComplete="username" required /></label>
          <label>Password<input type="password" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} autoComplete="current-password" required /></label>
          <button className="button button-primary" type="submit">Sign in</button>
          {message ? <p className="admin-message is-error">{message}</p> : null}
        </form>
      </section>
    </main>;
  }

  const editorVisible = isCreating || Boolean(form.id);
  const categoryOptions = Array.from(new Set(["Company news", "Project update", "Design & innovation", "Development", "Procurement", "Manufacturing", "Perspective", ...items.map((item) => item.category)])).filter(Boolean);

  return <main className="admin-shell">
    <header className="admin-header">
      <a className="admin-logo" href="/"><img src="/assets/nexmod-logo-final.png" alt="NEXMOD" /></a>
      <div><a href="/">View website</a><button onClick={logout}>Sign out</button></div>
    </header>
    <section className="admin-content">
      <div className="admin-intro">
        <p className="eyebrow">Admin / News</p>
        <h1>News library</h1>
        <p>Choose a story to edit it, or add a new one. Changes go live as soon as you save.</p>
      </div>
      <div className={`admin-grid ${editorVisible ? "has-editor" : ""}`}>
        <section className="admin-list">
          <div className="admin-list-heading">
            <p className="admin-form-label">Current news</p>
            <button className="button button-primary admin-add" onClick={beginCreate}>Add news <span aria-hidden="true">+</span></button>
          </div>
          {items.map((item) => <article className={form.id === item.id ? "is-selected" : ""} key={item.id}>
            <button className="admin-news-select" onClick={() => beginEdit(item)}>
              <img src={item.imageUrl || "/assets/news-south-melbourne.png"} alt="" />
              <span><small>{item.publishedAt} / {item.category}</small><b>{item.title}</b><em>{item.summary}</em></span>
              <i aria-hidden="true">&rarr;</i>
            </button>
          </article>)}
          {!items.length ? <p className="admin-empty">Your current news is loading.</p> : null}
        </section>
        {editorVisible ? <form className="admin-editor" onSubmit={save}>
          <div className="admin-editor-heading"><p className="admin-form-label">{form.id ? "Edit story" : "Add news"}</p><button className="admin-reset" type="button" onClick={closeEditor}>Close</button></div>
          <label>Title<input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></label>
          <label>Category<select value={isCreatingCategory ? "__new__" : form.category} onChange={(event) => { if (event.target.value === "__new__") { setIsCreatingCategory(true); setForm({ ...form, category: "" }); } else { setIsCreatingCategory(false); setForm({ ...form, category: event.target.value }); } }} required><option value="" disabled>Select a category</option>{categoryOptions.map((category) => <option value={category} key={category}>{category}</option>)}<option value="__new__">Create new category...</option></select>{isCreatingCategory ? <input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="New category name" required /> : null}</label>
          <label>Publication date<input value={form.publishedAt} onChange={(event) => setForm({ ...form, publishedAt: event.target.value })} placeholder="e.g. August 2026" required /></label>
          <label>Summary<textarea rows={5} value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} /></label>
          <label>Cover image<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setSelectedImage(event.target.files?.[0] || null)} /><span className="admin-upload-note">JPG, PNG or WebP - up to 3 MB</span></label>
          {form.imageUrl ? <img className="admin-image-preview" src={form.imageUrl} alt="Current story cover" /> : null}
          <div className="admin-actions"><button className="button button-primary" type="submit">{form.id ? "Save changes" : "Publish news"}</button>{form.id ? <button className="admin-delete" type="button" onClick={() => remove(form.id)}>Delete</button> : null}</div>
          {message ? <p className="admin-message">{message}</p> : null}
        </form> : null}
      </div>
    </section>
  </main>;
}
