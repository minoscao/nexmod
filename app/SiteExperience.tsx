"use client";

import { useEffect, useState } from "react";
import type { CSSProperties, FormEvent } from "react";

const capabilities = [
  { number: "01", title: "Design & innovation", copy: "A modular brief is resolved around whole rooms, real users and a buildable system from the first decision.", image: "capability-design" },
  { number: "02", title: "Development", copy: "Planning, approvals, design coordination and delivery strategy connected into one clear project pathway.", image: "capability-development" },
  { number: "03", title: "Procurement", copy: "Supply, manufacturing and construction decisions coordinated early to protect programme certainty and quality.", image: "capability-procurement" },
];

type NewsItem = { id?: number; date?: string; publishedAt?: string; category: string; title: string; summary?: string };

const defaultNews: NewsItem[] = [
  { date: "August 2026", category: "Project update", title: "A new South Melbourne modular living project enters design development." },
  { date: "July 2026", category: "Perspective", title: "Why room-scale modular delivery needs early procurement thinking." },
  { date: "June 2026", category: "Company news", title: "NEXMOD expands its international delivery network across Melbourne and Shenzhen." },
];

const projects = [
  { place: "South Melbourne, VIC", title: "South Melbourne living", copy: "A considered urban modular development designed around generous daylight, calm materiality and a compact city footprint.", image: "/assets/hero-modular-building.png", className: "project-south" },
  { place: "Western Australia", title: "WA regional accommodation", copy: "A durable, repeatable accommodation solution developed for a remote setting, reliable delivery and long-term performance.", image: "/assets/regional-project.png", className: "project-wa" },
];

function SplitText({ children }: { children: string }) {
  const words = children.split(" ");
  let index = 0;
  return <span className="split-text" aria-label={children}>{words.map((word, wordIndex) => {
    const letters = Array.from(word).map((character) => ({ character, index: index++ }));
    return <span className="split-word" aria-hidden="true" key={`${word}-${wordIndex}`}>{letters.map(({ character, index: charIndex }) => <span className="split-char" key={`${character}-${charIndex}`} style={{ "--char-index": charIndex } as CSSProperties}>{character}</span>)}</span>;
  })}</span>;
}

function SectionLabel({ children }: { children: string }) { return <p className="eyebrow">{children}</p>; }

export default function SiteExperience() {
  const [status, setStatus] = useState("");
  const [hasError, setHasError] = useState(false);
  const [newsItems, setNewsItems] = useState<NewsItem[]>(defaultNews);
  useEffect(() => {
    fetch("/api/news").then((response) => response.ok ? response.json() : null).then((data) => {
      if (data?.items?.length) setNewsItems(data.items);
    }).catch(() => undefined);
  }, []);
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const project = String(data.get("project") || "").trim();
    if (!name || !email || !project || !/^\S+@\S+\.\S+$/.test(email)) { setHasError(true); setStatus("Please complete the required fields and check your email address."); return; }
    setHasError(false); setStatus("Thank you. Your enquiry has been prepared for the NEXMOD team."); event.currentTarget.reset();
  }
  function onHeroPointerMove(event: React.PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--pointer-x", ((event.clientX - rect.left) / rect.width - .5).toFixed(3));
    event.currentTarget.style.setProperty("--pointer-y", ((event.clientY - rect.top) / rect.height - .5).toFixed(3));
  }

  return <main id="top">
    <a className="skip-link" href="#content">Skip to content</a>
    <header className="site-header">
      <a className="brand-logo" href="#top" aria-label="NEXMOD home"><img src="/assets/nexmod-logo-final.png" alt="NEXMOD Modular Development. Redefined" /></a>
      <nav className="main-nav" aria-label="Primary navigation"><a href="#about">About</a><a href="#capability">Capability</a><a href="#people">Our People</a><a href="#news">News</a><a href="#projects">Projects</a></nav>
      <a className="nav-contact" href="#contact">Contact</a>
    </header>

    <div id="content">
      <section className="hero" aria-labelledby="hero-title" onPointerMove={onHeroPointerMove}>
        <div className="hero-media"><img src="/assets/hero-modular-building.png" alt="Contemporary modular building in an Australian setting" /></div><div className="hero-scrim" />
        <div className="hero-content"><SectionLabel>NEXMOD / Modular development</SectionLabel><h1 id="hero-title"><SplitText>Modular development. Redefined.</SplitText></h1><p className="hero-copy">Integrated development, design and procurement for complete modular buildings.</p><div className="hero-actions"><a className="button button-primary" href="#projects">View projects</a><a className="text-link" href="#capability">Explore our capability</a></div></div>
        <div className="hero-index" aria-hidden="true"><span>Melbourne</span><i /><span>Shenzhen</span></div>
      </section>

      <section id="about" className="about section-pad" aria-labelledby="about-title">
        <div className="about-lead reveal"><SectionLabel>About</SectionLabel><h2 id="about-title"><SplitText>Better modular outcomes begin with a complete view.</SplitText></h2></div>
        <div className="about-copy reveal"><p>NEXMOD is a modular development company for projects that demand more than a product. We bring development thinking, buildable design and procurement discipline into one connected system.</p><p>Our focus is complete spaces: designed for people, manufactured with precision and delivered with a clear understanding of site, programme and value.</p><a className="text-link" href="#people">Meet our people</a></div>
      </section>

      <section id="capability" className="capability-section section-pad" aria-labelledby="capability-title">
        <div className="section-heading reveal"><SectionLabel>Capability</SectionLabel><h2 id="capability-title"><SplitText>Two connected hubs. One delivery system.</SplitText></h2><p>Melbourne directs Australian project outcomes. Shenzhen connects product development, sourcing and delivery intelligence.</p></div>
        <div className="capability-layout">
          <div className="network-map reveal" aria-label="NEXMOD capability network connecting Melbourne, Australia and Shenzhen, China"><div className="map-grid" /><p className="map-title">Delivery network</p><div className="map-route" /><button className="map-pin map-pin-melbourne" type="button"><b>Melbourne</b><span>Australia / project leadership</span></button><button className="map-pin map-pin-shenzhen" type="button"><b>Shenzhen</b><span>China / product & supply</span></button><div className="map-key"><span><i className="map-key-teal" /> Project leadership</span><span><i className="map-key-blue" /> Product & supply</span></div></div>
          <div className="capability-list">{capabilities.map((item) => <article className={`capability-card ${item.image} reveal`} key={item.number}><div className="capability-card-media" /><div className="capability-card-content"><span>{item.number}</span><div><h3>{item.title}</h3><p>{item.copy}</p></div><i aria-hidden="true">↗</i></div></article>)}</div>
        </div>
      </section>

      <section id="people" className="people section-pad" aria-labelledby="people-title">
        <div className="section-heading reveal"><SectionLabel>Our people</SectionLabel><h2 id="people-title"><SplitText>Different expertise. Shared accountability.</SplitText></h2></div>
        <div className="people-layout"><article className="people-block people-team reveal"><div className="people-block-image"><img src="/assets/interior-learning-space.png" alt="A calm contemporary interior designed as part of a complete modular building" /></div><div><p className="people-kicker">Our team</p><h3>Development people who understand buildings.</h3><p>Our core team bridges project strategy, design, commercial direction and delivery.</p><a className="text-link" href="#contact">Talk to our team</a></div></article><article className="people-block people-partners reveal"><div className="people-block-image"><img src="/assets/manufacturing-module.png" alt="A room-scale building module in a controlled manufacturing setting" /></div><div><p className="people-kicker">Our partners</p><h3>Specialists brought together around the project.</h3><p>We work with architects, consultants, fabricators and suppliers who share a commitment to quality and coordination.</p><a className="text-link" href="#contact">Partner with NEXMOD</a></div></article></div>
      </section>

      <section id="news" className="news section-pad" aria-labelledby="news-title"><div className="section-heading reveal"><SectionLabel>News</SectionLabel><h2 id="news-title"><SplitText>What we are building, thinking and learning.</SplitText></h2></div><div className="news-list">{newsItems.map((item, index) => <article className="news-item reveal" key={item.id ?? item.title}><span>{String(index + 1).padStart(2, "0")}</span><p>{item.publishedAt ?? item.date} / {item.category}</p><div><h3>{item.title}</h3>{item.summary ? <small>{item.summary}</small> : null}</div><a href="#contact" aria-label={`Read ${item.title}`}>↗</a></article>)}</div><a className="news-admin-link" href="/admin">News administration</a></section>

      <section id="projects" className="projects section-pad" aria-labelledby="projects-title"><div className="section-heading reveal"><SectionLabel>Projects</SectionLabel><h2 id="projects-title"><SplitText>Made for their place. Designed to perform.</SplitText></h2></div><div className="project-grid">{projects.map((project) => <article className={`project-card ${project.className} reveal`} key={project.title}><img src={project.image} alt="" /><div className="project-card-overlay" /><div className="project-card-content"><p>{project.place}</p><h3>{project.title}</h3><span>{project.copy}</span><a className="text-link" href="#contact">Project enquiry</a></div></article>)}</div></section>

      <section id="contact" className="contact section-pad" aria-labelledby="contact-title"><div className="contact-visual reveal"><div className="contact-photo"><img src="/assets/contact-modular-building.png" alt="A completed NEXMOD modular building at dusk" /></div><div className="contact-copy"><SectionLabel>Contact</SectionLabel><h2 id="contact-title"><SplitText>Let's build the right conversation.</SplitText></h2><p>Whether you are evaluating a site, developing a brief or progressing a live project, we would like to hear from you.</p><p className="contact-detail">Melbourne, Australia<br />Shenzhen, China<br />[Email address] / [Australian phone number]</p></div></div><form className="contact-form reveal" noValidate onSubmit={onSubmit}><div className={`field ${hasError ? "is-error" : ""}`}><label htmlFor="name">Name</label><input id="name" name="name" autoComplete="name" required /></div><div className="field"><label htmlFor="organisation">Organisation</label><input id="organisation" name="organisation" autoComplete="organization" /></div><div className={`field ${hasError ? "is-error" : ""}`}><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" required /></div><div className={`field ${hasError ? "is-error" : ""}`}><label htmlFor="project">Tell us about your project</label><textarea id="project" name="project" rows={4} required /></div><p className={`form-status ${hasError ? "is-error" : status ? "is-success" : ""}`} aria-live="polite">{status}</p><button className="button button-primary" type="submit">Send enquiry</button><p className="privacy">By submitting this form, you agree that NEXMOD may use your details to respond to your enquiry in accordance with our Privacy Policy.</p></form></section>
    </div>
    <footer className="site-footer"><a className="brand-logo footer-logo" href="#top"><img src="/assets/nexmod-logo-final.png" alt="NEXMOD Modular Development. Redefined" /></a><p>Modular development. Redefined.</p><a className="text-link" href="#contact">Contact NEXMOD</a></footer>
  </main>;
}
