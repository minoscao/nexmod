"use client";

import { useEffect, useState } from "react";
import { defaultNews, type NewsItem, withNewsImages } from "../../lib/news-content";

export default function NewsGallery() {
  const [items, setItems] = useState<NewsItem[]>(defaultNews);
  useEffect(() => {
    fetch("/api/news").then((response) => response.ok ? response.json() : null).then((data) => {
      if (data?.items?.length) setItems(withNewsImages(data.items));
    }).catch(() => undefined);
  }, []);

  return <main className="news-page">
    <header className="news-page-header"><a className="brand-logo" href="/" aria-label="NEXMOD home"><img src="/assets/nexmod-primary-vector-reverse.svg" alt="NEXMOD" /></a><a className="text-link" href="/">Back to NEXMOD</a></header>
    <section className="news-page-intro"><p className="eyebrow">News</p><h1>Project updates, perspectives and progress.</h1><p>Stories from the people, places and decisions that shape complete modular buildings.</p></section>
    <section className="news-gallery" aria-label="All NEXMOD news">{items.map((item, index) => <article className="news-gallery-card" key={item.id ?? item.title}><div className="news-gallery-image"><img src={item.image} alt="" /><span>{String(index + 1).padStart(2, "0")}</span></div><p>{item.publishedAt ?? item.date} / {item.category}</p><h2>{item.title}</h2>{item.summary ? <div>{item.summary}</div> : null}<a className="text-link" href="/#contact">Discuss a project</a></article>)}</section>
    <footer className="site-footer"><a className="brand-logo footer-logo" href="/"><img src="/assets/nexmod-primary-vector-reverse.svg" alt="NEXMOD" /></a><a className="footer-admin-link" href="/admin">News administration</a></footer>
  </main>;
}
