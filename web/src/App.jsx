import { useState, useEffect, useRef } from "react";
import BookingModal from "./BookingModal.jsx";
import { usePageMeta } from "./usePageMeta.js";
import { useJsonLd } from "./useJsonLd.js";

// ─── ROUTING ────────────────────────────────────────────────
const PAGES = {
  home: "home",
  services: "services",
  about: "about",
  contact: "contact",
};

// ─── SHARED DATA ────────────────────────────────────────────
const TRUST_SIGNALS = [
  { icon: "✦", text: "Brisbane-based, face-to-face available" },
  { icon: "◆", text: "Vendor-neutral — no commissions, ever" },
  { icon: "★", text: "Fixed-price projects, no scope creep" },
  { icon: "♥", text: "Plain language — zero jargon guaranteed" },
  { icon: "◎", text: "14-day action plan or your money back" },
];

const HOW_IT_WORKS = [
  {
    label: "ASSESS",
    time: "30 min",
    text: "Book a free clarity call. We listen to how your business runs, where the friction is, and what you've already tried. No pitch. No pressure. Just an honest map of where AI can save you real time and money.",
  },
  {
    label: "ROADMAP",
    time: "1–2 weeks",
    text: "We deliver a concrete AI action plan — specific tools, a realistic timeline, and a budget that actually fits your business. Not a strategy document that sits on a shelf. A working plan you can act on next week.",
  },
  {
    label: "IMPLEMENT",
    time: "Ongoing",
    text: "We set it up, train your team, and stay on as your ongoing AI advisor. When a new tool launches or your needs change, we're already in your corner — not starting from zero.",
  },
];

const PERSONAS = [
  {
    tag: "TRADES & CONSTRUCTION",
    headline: "Win back your evenings.",
    body: "Quoting, scheduling, compliance documentation — the admin that follows you home. We automate the repetitive so you can focus on the work that actually makes money.",
  },
  {
    tag: "RETAIL & E-COMMERCE",
    headline: "Sell smarter, not harder.",
    body: "Inventory forecasting, marketing content, customer service bots. AI turns one person's work into three — without the hiring headache.",
  },
  {
    tag: "ALLIED HEALTH & PROFESSIONAL SERVICES",
    headline: "Less admin, more of what matters.",
    body: "Appointment follow-ups, document automation, client communication. We handle the compliance questions so you can implement with confidence.",
  },
];

const SERVICES_OVERVIEW = [
  {
    title: "AI Readiness Assessment",
    price: "From $1,800",
    description: "Two to three sessions plus a detailed 20-page report. We assess your current tools, identify the highest-value AI opportunities, and give you a prioritised list of exactly where to start.",
    highlights: ["On-site visits included", "Role-by-role opportunity map", "Vendor-neutral recommendations", "ROI estimates for each opportunity"],
  },
  {
    title: "Custom AI Strategy Roadmap",
    price: "From $4,500",
    description: "A 12-month implementation roadmap built around your specific goals. More than a plan — it's a working document your team can execute from. Includes vendor evaluations, budget forecasts, staff adoption strategy, and success metrics.",
    highlights: ["12-month phased plan", "Tool selection + vendor shortlisting", "Change management guidance", "Staff adoption strategy"],
  },
  {
    title: "Implementation & Ongoing Support",
    price: "From $800/month",
    description: "We don't just hand you a plan and disappear. We stay on as your AI advisor — setting up systems, training staff, reviewing performance, and adapting your strategy as AI evolves.",
    highlights: ["Monthly to weekly advisory sessions", "Priority support", "Quarterly ROI reviews", "Staff training workshops"],
  },
];

const RETAINERS = [
  {
    name: "Starter",
    price: "$800",
    period: "/month",
    bestFor: "Best for 1–5 staff",
    features: [
      "Monthly 60-min strategy call",
      "Email & chat support",
      "Quarterly AI landscape update",
      "1 tool review per quarter",
    ],
    cta: "Start with Starter",
  },
  {
    name: "Growth",
    price: "$1,800",
    period: "/month",
    bestFor: "Best for 6–20 staff",
    features: [
      "Bi-weekly strategy sessions",
      "Priority same-day support",
      "Monthly performance review",
      "2 tool evaluations per quarter",
      "1 staff workshop per quarter",
    ],
    cta: "Start with Growth",
    featured: true,
  },
  {
    name: "Scale",
    price: "$3,500",
    period: "/month",
    bestFor: "Best for 21–50 staff",
    features: [
      "Weekly dedicated advisor",
      "On-site visits (up to 2/month)",
      "Full KPI dashboard",
      "Unlimited tool evaluations",
      "Monthly all-staff training",
    ],
    cta: "Start with Scale",
  },
];

const REVIEWS = [
  { stars: 5, text: "I kept hearing about AI but had no idea where to start. Six weeks later, our quoting process is fully automated and I've got my Wednesday afternoons back.", name: "Donna P.", label: "trades company, Northside Brisbane" },
  { stars: 5, text: "The clarity call alone was worth it. They told me exactly which tools to use and which ones to skip. Saved me thousands in wrong decisions.", name: "Marcus T.", label: "retail, Fortitude Valley" },
  { stars: 5, text: "Our admin team was drowning in appointment follow-ups. The AI system packading built has practically eliminated that problem.", name: "Sarah K.", label: "allied health, South Brisbane" },
];

const FAQS = [
  { q: "How is packading.ai different from a national AI consultancy?", a: "We're local, we show up in person, and we charge small-business rates. You'll talk to the same person every time — not a junior consultant reading from a slide deck. We're embedded in the Brisbane business community and we're accountable to it." },
  { q: "Do I need to know anything about AI before we start?", a: "No. That's the point. Our job is to translate the technology into plain language and tell you exactly what will work for your specific situation. We start where you are, not where we think you should be." },
  { q: "What industries do you work with?", a: "Trades and construction, retail, professional services, allied health, hospitality, and real estate. If you have repetitive admin, you have AI opportunity. We've built industry-specific playbooks for each vertical." },
  { q: "How long before I see results?", a: "Most clients save 5–10 hours per week within 60 days of their first implementation. The clarity call and readiness assessment typically identify at least three quick wins you can action immediately — before any major project begins." },
  { q: "Is my business data safe?", a: "Yes. We only recommend tools with Australian data residency or strong Privacy Act compliance. We never access your data directly — we advise on tools and implementations that you control." },
  { q: "What does 'vendor-neutral' actually mean?", a: "We don't earn commissions from any software vendor. Our only incentive is recommending what's right for your business. If the best tool for you is a free one, that's what we'll tell you." },
  { q: "What's included in the free clarity call?", a: "A 30-minute video or phone call where we map your current workflows, identify your biggest time and cost drains, and give you an honest assessment of where AI can help. No sales pitch. You'll leave with clarity regardless of whether we work together." },
];

// ─── BRAND PALETTE ──────────────────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --charcoal: #141414;
    --terracotta: #C4724A;
    --terracotta-hover: #D4845A;
    --bone: #F5F0EB;
    --blush: #F0DDD0;
    --brown: #4A4035;
    --sand: #C4B8A8;
    --text-secondary: #8A8070;
    --white: #FFFFFF;
    --font-display: 'Playfair Display', 'Georgia', serif;
    --font-body: 'Inter', -apple-system, sans-serif;
  }

  html { scroll-behavior: smooth; }
  body { font-family: var(--font-body); background: var(--bone); color: var(--brown); -webkit-font-smoothing: antialiased; }
  ::selection { background: var(--terracotta); color: var(--bone); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .fade-up { animation: fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
  .fade-in { animation: fadeIn 0.6s ease forwards; }
  .delay-1 { animation-delay: 0.12s; }
  .delay-2 { animation-delay: 0.24s; }
  .delay-3 { animation-delay: 0.36s; }
  .delay-4 { animation-delay: 0.48s; }

  @media (max-width: 768px) {
    .desktop-nav { display: none !important; }
    .mobile-menu-btn { display: block !important; }
    .hero-grid, .bio-grid { grid-template-columns: 1fr !important; }
    .retainer-grid { grid-template-columns: 1fr !important; }
    .three-col { grid-template-columns: 1fr !important; }
  }
  @media (max-width: 480px) {
    .footer-grid { grid-template-columns: 1fr !important; }
  }
  @media (min-width: 481px) and (max-width: 768px) {
    .footer-grid { grid-template-columns: 1fr 1fr !important; }
  }
`;

// ─── LOGO ────────────────────────────────────────────────────
function BrandLogo({ height = 40, light = false }) {
  const fontSize = height * 0.7;
  const dotAiSize = height * 0.42;
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
      <span style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontWeight: 700,
        fontSize,
        color: light ? "#F5F0EB" : "#141414",
        letterSpacing: "-0.5px",
        lineHeight: 1,
      }}>Pack</span>
      <span style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontWeight: 400,
        fontStyle: "italic",
        fontSize,
        color: "#C4724A",
        letterSpacing: "-0.5px",
        lineHeight: 1,
      }}>ading</span>
      <span style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontWeight: 400,
        fontSize: dotAiSize,
        color: "#C4724A",
        letterSpacing: "1px",
        lineHeight: 1,
        marginLeft: 2,
        alignSelf: "flex-end",
        paddingBottom: height * 0.06,
      }}>.ai</span>
    </div>
  );
}

// ─── PRIMITIVES ─────────────────────────────────────────────
function Container({ children, style = {} }) {
  return <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px", ...style }}>{children}</div>;
}

function Section({ children, style = {}, dark = false, id, blush = false }) {
  const bg = dark ? "var(--charcoal)" : blush ? "var(--blush)" : "var(--bone)";
  const color = dark ? "var(--bone)" : "var(--brown)";
  return (
    <section id={id} style={{ padding: "88px 0", background: bg, color, ...style }}>
      <Container>{children}</Container>
    </section>
  );
}

function SectionLabel({ text, light = false }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 500, textTransform: "uppercase",
      letterSpacing: "0.16em", color: light ? "var(--sand)" : "var(--terracotta)",
      marginBottom: 14,
    }}>{text}</div>
  );
}

function SectionTitle({ children, sub, light = false }) {
  return (
    <div style={{ marginBottom: sub ? 16 : 36 }}>
      <h2 style={{
        fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 46px)",
        fontWeight: 600, lineHeight: 1.12, color: "inherit",
        letterSpacing: "-0.02em", maxWidth: 720,
      }}>{children}</h2>
      {sub && <p style={{
        fontSize: 17, lineHeight: 1.65,
        color: light ? "rgba(245,240,235,0.7)" : "var(--text-secondary)",
        marginTop: 16, maxWidth: 580,
      }}>{sub}</p>}
    </div>
  );
}

function PrimaryButton({ children, large, style = {}, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      background: h ? "var(--terracotta-hover)" : "var(--terracotta)",
      color: "var(--bone)", border: "none",
      padding: large ? "18px 44px" : "14px 34px", borderRadius: 6, cursor: "pointer",
      fontFamily: "var(--font-body)", fontSize: large ? 16 : 14.5, fontWeight: 500,
      letterSpacing: "0.02em", transition: "all 0.3s ease",
      transform: h ? "translateY(-1px)" : "none",
      boxShadow: h ? "0 6px 20px rgba(196,114,74,0.35)" : "none", ...style,
    }}>{children}</button>
  );
}

function SecondaryButton({ children, onClick, light = false }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      background: "transparent",
      color: light ? "var(--bone)" : "var(--brown)",
      border: `1.5px solid ${h ? (light ? "rgba(245,240,235,0.6)" : "var(--terracotta)") : (light ? "rgba(245,240,235,0.3)" : "var(--sand)")}`,
      padding: "14px 34px", borderRadius: 6, cursor: "pointer",
      fontFamily: "var(--font-body)", fontSize: 14.5, fontWeight: 400,
      letterSpacing: "0.02em", transition: "all 0.25s",
    }}>{children}</button>
  );
}

// ─── NAV BAR ────────────────────────────────────────────────
function NavBar({ page, setPage, openBooking }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navItems = [
    { label: "Services", key: PAGES.services },
    { label: "About", key: PAGES.about },
    { label: "Contact", key: PAGES.contact },
  ];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? "rgba(20,20,20,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(196,114,74,0.12)" : "none",
        transition: "all 0.3s ease",
        padding: "0 28px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
          <button onClick={() => { setPage(PAGES.home); setMenuOpen(false); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <BrandLogo height={34} light />
          </button>

          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 40 }}>
            {navItems.map(item => (
              <button key={item.key} onClick={() => setPage(item.key)} style={{
                background: "none", border: "none", cursor: "pointer",
                color: page === item.key ? "var(--terracotta)" : "rgba(245,240,235,0.75)",
                fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 400,
                letterSpacing: "0.04em", transition: "color 0.2s",
                padding: "4px 0",
              }}>{item.label}</button>
            ))}
            <PrimaryButton onClick={openBooking} style={{ padding: "10px 24px", fontSize: 13.5 }}>
              Book a Clarity Call
            </PrimaryButton>
          </div>

          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} style={{
            display: "none", background: "none", border: "none", cursor: "pointer",
            color: "var(--bone)", fontSize: 24, lineHeight: 1,
          }}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div style={{
          position: "fixed", top: 72, left: 0, right: 0, bottom: 0,
          background: "rgba(20,20,20,0.98)", zIndex: 999,
          display: "flex", flexDirection: "column", padding: "40px 28px", gap: 8,
        }}>
          {navItems.map(item => (
            <button key={item.key} onClick={() => { setPage(item.key); setMenuOpen(false); }} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--bone)", fontFamily: "var(--font-body)",
              fontSize: 20, fontWeight: 400, textAlign: "left", padding: "16px 0",
              borderBottom: "1px solid rgba(196,114,74,0.12)",
            }}>{item.label}</button>
          ))}
          <PrimaryButton onClick={() => { openBooking(); setMenuOpen(false); }} large style={{ marginTop: 24, width: "100%" }}>
            Book a Clarity Call
          </PrimaryButton>
        </div>
      )}
    </>
  );
}

// ─── REVIEW CARD ─────────────────────────────────────────────
function ReviewCard({ stars, text, name, label, light = false }) {
  return (
    <div style={{
      background: light ? "rgba(255,255,255,0.06)" : "var(--white)",
      border: `1px solid ${light ? "rgba(196,114,74,0.15)" : "rgba(196,114,74,0.1)"}`,
      borderRadius: 12, padding: "32px",
    }}>
      <div style={{ color: "var(--terracotta)", fontSize: 16, marginBottom: 16, letterSpacing: 2 }}>
        {"★".repeat(stars)}
      </div>
      <p style={{
        fontFamily: "var(--font-display)", fontStyle: "italic",
        fontSize: 17, lineHeight: 1.65,
        color: light ? "rgba(245,240,235,0.9)" : "var(--brown)",
        marginBottom: 20,
      }}>"{text}"</p>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: light ? "var(--bone)" : "var(--brown)" }}>{name}</div>
        <div style={{ fontSize: 12, color: "var(--terracotta)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 3 }}>{label}</div>
      </div>
    </div>
  );
}

// ─── FAQ ITEM ────────────────────────────────────────────────
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(196,114,74,0.15)", padding: "20px 0" }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", background: "none", border: "none", cursor: "pointer",
        display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16,
        textAlign: "left", padding: 0,
      }}>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 16, fontWeight: 500, color: "var(--bone)", lineHeight: 1.4 }}>{q}</span>
        <span style={{ color: "var(--terracotta)", fontSize: 20, flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(45deg)" : "none" }}>+</span>
      </button>
      {open && (
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(245,240,235,0.75)", marginTop: 14, paddingRight: 32 }}>{a}</p>
      )}
    </div>
  );
}

// ─── HOME PAGE ───────────────────────────────────────────────
function HomePage({ setPage, openBooking }) {
  usePageMeta({
    title: "packading.ai — AI Packaged for Brisbane's Small Businesses",
    description: "Brisbane's AI advisory and implementation agency for small businesses. Vendor-neutral, practical, results-first. Book a free 30-minute clarity call.",
    canonical: "https://packading.ai/",
  });

  return (
    <>
      {/* HERO */}
      <div style={{
        background: "var(--charcoal)", minHeight: "100vh",
        display: "flex", alignItems: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "radial-gradient(circle at 30% 50%, #C4724A 0%, transparent 60%), radial-gradient(circle at 80% 20%, #C4724A 0%, transparent 50%)",
        }} />
        <div style={{
          position: "absolute", inset: 40, borderRadius: 24,
          border: "0.5px solid rgba(196,114,74,0.12)", pointerEvents: "none",
        }} />

        <Container style={{ paddingTop: 120, paddingBottom: 80 }}>
          <div style={{ maxWidth: 780 }}>
            <div className="fade-up" style={{
              display: "inline-block",
              background: "rgba(196,114,74,0.12)", border: "1px solid rgba(196,114,74,0.25)",
              borderRadius: 4, padding: "6px 14px", marginBottom: 32,
            }}>
              <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", color: "var(--terracotta)", textTransform: "uppercase" }}>
                Brisbane AI Advisory
              </span>
            </div>

            <h1 className="fade-up delay-1" style={{
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: "clamp(36px, 5.5vw, 72px)", lineHeight: 1.05,
              color: "var(--bone)", letterSpacing: "-0.02em", marginBottom: 28,
            }}>
              AI is moving fast.<br />
              <span style={{ color: "var(--terracotta)", fontStyle: "italic" }}>Your business shouldn't fall behind.</span>
            </h1>

            <p className="fade-up delay-2" style={{
              fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.7,
              color: "rgba(245,240,235,0.75)", marginBottom: 40, maxWidth: 620,
            }}>
              We help Brisbane's small businesses implement practical AI — without the jargon, without the enterprise price tag, and without the confusion.
            </p>

            <div className="fade-up delay-3" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <PrimaryButton large onClick={openBooking}>Book a Free Clarity Call</PrimaryButton>
              <SecondaryButton light onClick={() => setPage(PAGES.services)}>See our services</SecondaryButton>
            </div>

            <div className="fade-up delay-4" style={{ marginTop: 56, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Brisbane-based", "Vendor-neutral", "Fixed-price projects", "No jargon"].map(tag => (
                <span key={tag} style={{
                  fontSize: 12, color: "rgba(245,240,235,0.5)",
                  border: "1px solid rgba(245,240,235,0.12)", borderRadius: 4,
                  padding: "5px 12px", letterSpacing: "0.04em",
                }}>{tag}</span>
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* TRUST BAR */}
      <div style={{ background: "var(--terracotta)", padding: "18px 0" }}>
        <Container>
          <div style={{ display: "flex", gap: 36, flexWrap: "wrap", justifyContent: "center" }}>
            {TRUST_SIGNALS.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 13, color: "rgba(245,240,235,0.7)" }}>{t.icon}</span>
                <span style={{ fontSize: 13, color: "var(--bone)", fontWeight: 400, whiteSpace: "nowrap" }}>{t.text}</span>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* WHO WE HELP */}
      <Section blush>
        <SectionLabel text="Who we help" />
        <SectionTitle sub="We've built industry-specific AI playbooks for the businesses that make Brisbane run.">
          Real businesses. Real problems. Real results.
        </SectionTitle>
        <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 48 }}>
          {PERSONAS.map((p, i) => (
            <div key={i} style={{
              background: "var(--bone)", borderRadius: 12, padding: "32px",
              border: "1px solid rgba(196,114,74,0.12)",
            }}>
              <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.14em", color: "var(--terracotta)", textTransform: "uppercase", marginBottom: 16 }}>{p.tag}</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--charcoal)", marginBottom: 14, lineHeight: 1.25 }}>{p.headline}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-secondary)" }}>{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section dark>
        <SectionLabel text="How it works" light />
        <SectionTitle light sub="Three steps from confusion to clarity — most clients see results within 60 days.">
          From first call to working system.
        </SectionTitle>
        <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40, marginTop: 48 }}>
          {HOW_IT_WORKS.map((step, i) => (
            <div key={i}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "rgba(196,114,74,0.15)", border: "1px solid rgba(196,114,74,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 600, color: "var(--terracotta)",
                }}>{i + 1}</div>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", color: "var(--terracotta)", textTransform: "uppercase" }}>{step.label}</div>
                <div style={{ fontSize: 11, color: "rgba(245,240,235,0.4)", marginLeft: "auto" }}>{step.time}</div>
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: "rgba(245,240,235,0.7)" }}>{step.text}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 56 }}>
          <PrimaryButton large onClick={openBooking}>Start with a free clarity call</PrimaryButton>
        </div>
      </Section>

      {/* SERVICES OVERVIEW */}
      <Section>
        <SectionLabel text="What we do" />
        <SectionTitle sub="Every engagement is fixed-price and outcome-defined. No scope creep. No vague deliverables.">
          Three ways to work with us.
        </SectionTitle>
        <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 48 }}>
          {SERVICES_OVERVIEW.map((s, i) => (
            <div key={i} style={{
              background: "var(--white)", borderRadius: 12, padding: "36px 32px",
              border: "1px solid rgba(196,114,74,0.1)", display: "flex", flexDirection: "column",
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--terracotta)", letterSpacing: "0.06em", marginBottom: 12 }}>{s.price}</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--charcoal)", marginBottom: 16, lineHeight: 1.25 }}>{s.title}</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: 28, flex: 1 }}>{s.description}</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {s.highlights.map((h, j) => (
                  <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13.5, color: "var(--brown)" }}>
                    <span style={{ color: "var(--terracotta)", flexShrink: 0, marginTop: 1 }}>✓</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 40, textAlign: "center" }}>
          <button onClick={() => setPage(PAGES.services)} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--terracotta)", fontFamily: "var(--font-body)",
            fontSize: 14, fontWeight: 500,
            textDecoration: "underline", textUnderlineOffset: 4,
          }}>See full pricing and service details →</button>
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section dark>
        <SectionLabel text="Client results" light />
        <SectionTitle light>Real businesses. Measurable outcomes.</SectionTitle>
        <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 48 }}>
          {REVIEWS.map((r, i) => <ReviewCard key={i} {...r} light />)}
        </div>
      </Section>

      {/* FAQ */}
      <Section dark style={{ paddingTop: 0 }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <SectionLabel text="Common questions" light />
          <SectionTitle light>Everything you're wondering about.</SectionTitle>
          <div style={{ marginTop: 40 }}>
            {FAQS.map((f, i) => <FAQItem key={i} {...f} />)}
          </div>
        </div>
      </Section>

      {/* CTA BANNER */}
      <div style={{ background: "var(--terracotta)", padding: "80px 28px", textAlign: "center" }}>
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", color: "rgba(245,240,235,0.7)", textTransform: "uppercase", marginBottom: 20 }}>FREE · 30 MINUTES · NO OBLIGATION</p>
        <h2 style={{
          fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 46px)",
          fontWeight: 700, color: "var(--bone)", letterSpacing: "-0.02em",
          marginBottom: 20, lineHeight: 1.1,
        }}>
          Book a clarity call.<br />Walk away with a plan.
        </h2>
        <p style={{ fontSize: 17, color: "rgba(245,240,235,0.85)", marginBottom: 40, maxWidth: 480, margin: "0 auto 40px" }}>
          30 minutes. We map your biggest AI opportunities. You leave with clarity — even if we never work together.
        </p>
        <button onClick={openBooking} style={{
          background: "var(--charcoal)", color: "var(--bone)", border: "none",
          padding: "18px 48px", borderRadius: 6, cursor: "pointer",
          fontFamily: "var(--font-body)", fontSize: 16, fontWeight: 500,
          letterSpacing: "0.02em",
        }}>Book your free clarity call</button>
      </div>
    </>
  );
}

// ─── SERVICES PAGE ───────────────────────────────────────────
function ServicesPage({ openBooking }) {
  usePageMeta({
    title: "Services & Pricing — packading.ai",
    description: "AI Readiness Assessments, Strategy Roadmaps, Implementation Support and monthly retainers for Brisbane SMBs. Transparent, fixed pricing.",
    canonical: "https://packading.ai/services",
  });

  const projectServices = [
    {
      name: "AI Readiness Assessment",
      price: "$1,800 – $3,500",
      duration: "2–3 weeks",
      description: "The starting point for most clients. We audit your current tools, workflows, and staff pain points. The result is a 20-page AI Readiness Report that maps every automation opportunity in your business, ranked by ease of implementation and estimated return.",
      includes: [
        "2–3 on-site or video sessions",
        "20-page AI Readiness Report",
        "Prioritised opportunity map (low effort → high impact first)",
        "Vendor-neutral tool recommendations",
        "ROI estimate for each recommendation",
        "30-min debrief call with your team",
      ],
      bestFor: "Any business that's AI-curious but doesn't know where to start.",
    },
    {
      name: "Custom AI Strategy Roadmap",
      price: "$4,500 – $9,000",
      duration: "3–5 weeks",
      description: "A 12-month implementation roadmap built around your specific goals. More than a plan — it's a working document your team can execute from. Includes vendor evaluations, budget forecasts, staff adoption strategy, and success metrics.",
      includes: [
        "Everything in the AI Readiness Assessment",
        "12-month phased implementation roadmap",
        "Vendor evaluation reports (up to 3 tools)",
        "Budget and ROI forecast",
        "Change management & staff adoption plan",
        "One revision round included",
      ],
      bestFor: "Businesses ready to commit to AI and wanting a clear, accountable path.",
    },
    {
      name: "Implementation & Integration",
      price: "$3,500 – $18,000",
      duration: "Project-based",
      description: "We don't just advise — we build. Automation setup, AI tool integration, workflow design, and hands-on staff training. Scoped and priced to your specific implementation needs.",
      includes: [
        "Automation setup (n8n, Make, Zapier, or native tools)",
        "AI tool configuration and integration",
        "Staff training (role-specific)",
        "Documentation and playbooks",
        "30-day post-implementation support",
        "Performance baseline and measurement setup",
      ],
      bestFor: "Businesses with a clear AI roadmap ready to execute it.",
    },
    {
      name: "Staff Training Workshops",
      price: "$900 (half-day) / $1,800 (full-day)",
      duration: "Half-day or full-day",
      description: "Hands-on, role-specific AI training for your team. We teach your staff how to use AI tools effectively in their actual jobs — not a generic introduction to ChatGPT.",
      includes: [
        "Role-specific curriculum (tailored to your team)",
        "Hands-on tool practice",
        "Prompt writing for your use cases",
        "Take-home reference guide",
        "Follow-up Q&A session (30 min, one week later)",
      ],
      bestFor: "Teams that have AI tools but aren't using them confidently or consistently.",
    },
  ];

  return (
    <>
      <div style={{ background: "var(--charcoal)", paddingTop: 140, paddingBottom: 80, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 40, borderRadius: 24, border: "0.5px solid rgba(196,114,74,0.12)", pointerEvents: "none" }} />
        <Container>
          <SectionLabel text="Services & Pricing" light />
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: "clamp(32px, 5vw, 60px)", color: "var(--bone)",
            letterSpacing: "-0.02em", lineHeight: 1.1, maxWidth: 680, marginBottom: 24,
          }}>
            Transparent pricing.<br />
            <span style={{ color: "var(--terracotta)", fontStyle: "italic" }}>Fixed outcomes.</span>
          </h1>
          <p style={{ fontSize: 18, color: "rgba(245,240,235,0.7)", maxWidth: 560, lineHeight: 1.65 }}>
            Every engagement is scope-defined and fixed-price. No surprise invoices. No open-ended retainers you can't exit. You always know exactly what you're getting.
          </p>
        </Container>
      </div>

      {/* Project Services */}
      <Section blush>
        <SectionLabel text="Project services" />
        <SectionTitle sub="Defined deliverables, fixed price, clear timeline. Each project stands alone — or leads into an ongoing retainer.">
          One-off engagements.
        </SectionTitle>
        {projectServices.map((svc, i) => (
          <div key={i} style={{
            background: "var(--bone)", borderRadius: 12, border: "1px solid rgba(196,114,74,0.12)",
            padding: "40px", marginBottom: 24,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
              <div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, color: "var(--charcoal)", marginBottom: 6 }}>{svc.name}</h3>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13, color: "var(--terracotta)", fontWeight: 600 }}>{svc.price}</span>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>· {svc.duration}</span>
                </div>
              </div>
              <PrimaryButton onClick={openBooking}>Book a clarity call</PrimaryButton>
            </div>
            <p style={{ fontSize: 15.5, lineHeight: 1.75, color: "var(--text-secondary)", marginBottom: 28 }}>{svc.description}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginBottom: 20 }}>
              {svc.includes.map((item, j) => (
                <div key={j} style={{ display: "flex", gap: 10, fontSize: 13.5, color: "var(--brown)" }}>
                  <span style={{ color: "var(--terracotta)", flexShrink: 0 }}>✓</span>{item}
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(196,114,74,0.08)", borderRadius: 6, padding: "12px 16px", fontSize: 13, color: "var(--brown)" }}>
              <strong>Best for:</strong> {svc.bestFor}
            </div>
          </div>
        ))}
      </Section>

      {/* Retainers */}
      <Section dark>
        <SectionLabel text="Ongoing retainers" light />
        <SectionTitle light sub="Month-to-month. Cancel anytime with 30 days notice. Most clients stay 24+ months because they keep seeing results.">
          Stay ahead as AI evolves.
        </SectionTitle>
        <div className="retainer-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 48 }}>
          {RETAINERS.map((r, i) => (
            <div key={i} style={{
              background: r.featured ? "var(--terracotta)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${r.featured ? "var(--terracotta)" : "rgba(196,114,74,0.2)"}`,
              borderRadius: 12, padding: "36px 32px", position: "relative",
            }}>
              {r.featured && (
                <div style={{
                  position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                  background: "var(--charcoal)", color: "var(--bone)",
                  fontSize: 10, fontWeight: 600, letterSpacing: "0.12em",
                  padding: "4px 14px", borderRadius: 20, textTransform: "uppercase", whiteSpace: "nowrap",
                }}>Most popular</div>
              )}
              <div style={{ fontSize: 13, fontWeight: 500, color: r.featured ? "rgba(245,240,235,0.8)" : "rgba(245,240,235,0.5)", marginBottom: 8 }}>{r.name} Retainer</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 42, fontWeight: 700, color: "var(--bone)", lineHeight: 1 }}>{r.price}</span>
                <span style={{ fontSize: 14, color: r.featured ? "rgba(245,240,235,0.7)" : "rgba(245,240,235,0.5)" }}>{r.period}</span>
              </div>
              <div style={{ fontSize: 12, color: r.featured ? "rgba(245,240,235,0.7)" : "rgba(245,240,235,0.4)", marginBottom: 28 }}>{r.bestFor}</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                {r.features.map((f, j) => (
                  <li key={j} style={{ display: "flex", gap: 10, fontSize: 13.5, color: r.featured ? "rgba(245,240,235,0.9)" : "rgba(245,240,235,0.65)" }}>
                    <span style={{ color: r.featured ? "rgba(245,240,235,0.7)" : "var(--terracotta)", flexShrink: 0 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <button onClick={openBooking} style={{
                width: "100%", padding: "14px",
                background: r.featured ? "var(--charcoal)" : "var(--terracotta)",
                color: "var(--bone)", border: "none", borderRadius: 6,
                fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 500,
                cursor: "pointer", letterSpacing: "0.02em",
              }}>{r.cta}</button>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", marginTop: 32, fontSize: 13, color: "rgba(245,240,235,0.4)" }}>
          All retainers are month-to-month. No lock-in contracts. 30 days notice to cancel.
        </p>
      </Section>

      <Section blush style={{ textAlign: "center" }}>
        <SectionLabel text="Not sure where to start?" />
        <SectionTitle sub="A 30-minute clarity call is free, obligation-free, and genuinely useful — regardless of whether we work together.">
          Start with a clarity call.
        </SectionTitle>
        <PrimaryButton large onClick={openBooking}>Book your free clarity call</PrimaryButton>
      </Section>
    </>
  );
}

// ─── ABOUT PAGE ──────────────────────────────────────────────
function AboutPage({ openBooking }) {
  usePageMeta({
    title: "About — packading.ai",
    description: "Brisbane's AI advisory agency for small businesses. Practical, vendor-neutral, local.",
    canonical: "https://packading.ai/about",
  });

  return (
    <>
      <div style={{ background: "var(--charcoal)", paddingTop: 140, paddingBottom: 80, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 40, borderRadius: 24, border: "0.5px solid rgba(196,114,74,0.12)", pointerEvents: "none" }} />
        <Container>
          <SectionLabel text="About packading.ai" light />
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: "clamp(32px, 5vw, 60px)", color: "var(--bone)",
            letterSpacing: "-0.02em", lineHeight: 1.1, maxWidth: 700, marginBottom: 24,
          }}>
            AI advice that actually fits<br />
            <span style={{ color: "var(--terracotta)", fontStyle: "italic" }}>a real small business.</span>
          </h1>
        </Container>
      </div>

      <Section>
        <div className="bio-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <SectionLabel text="Why we exist" />
            <SectionTitle>Enterprise consultants charge $100K. We don't.</SectionTitle>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--text-secondary)", marginBottom: 20 }}>
              Most AI consultancies are built for large enterprises with six-figure budgets and a team to manage the implementation. The advice is generic. The fees are prohibitive. The outcome is usually a polished slide deck that no one acts on.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--text-secondary)", marginBottom: 20 }}>
              Brisbane's small businesses have real AI opportunities — but they need advice that's practical, local, and priced for an SMB budget. That's why packading.ai exists.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--text-secondary)" }}>
              We work with trades companies, retailers, allied health practices, and professional service firms across South East Queensland. We show up in person, we speak plainly, and we stay until the work is actually working.
            </p>
          </div>
          <div style={{ background: "var(--blush)", borderRadius: 12, padding: "48px 40px", border: "1px solid rgba(196,114,74,0.12)" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontStyle: "italic", color: "var(--terracotta)", marginBottom: 20, lineHeight: 1.6 }}>
              "To make artificial intelligence accessible, affordable, and actionable for every small business in Brisbane — packaging complexity into competitive advantage."
            </div>
            <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.1em", color: "var(--text-secondary)", textTransform: "uppercase" }}>Our mission</div>
          </div>
        </div>
      </Section>

      <Section blush>
        <SectionLabel text="How we work" />
        <SectionTitle sub="Five principles that drive every engagement.">What we believe.</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24, marginTop: 48 }}>
          {[
            { title: "Grounded", body: "No buzzwords. No AI hype. We tell you what will actually work for your business today." },
            { title: "Vendor-neutral", body: "No commissions, no vendor contracts. The only thing that influences our recommendations is what's right for you." },
            { title: "Local", body: "Brisbane-based. We show up in person. We're embedded in the same community you're building in." },
            { title: "Practical", body: "We deliver working systems, not strategy documents. Every engagement ends with something you can use on Monday." },
            { title: "Accountable", body: "Fixed-price projects. Defined outcomes. KPI-linked retainers. We measure success by your results — not our hours." },
          ].map((v, i) => (
            <div key={i} style={{
              background: "var(--bone)", borderRadius: 10, padding: "28px 24px",
              border: "1px solid rgba(196,114,74,0.1)",
            }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(196,114,74,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <span style={{ color: "var(--terracotta)", fontSize: 16 }}>✦</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "var(--charcoal)", marginBottom: 10 }}>{v.title}</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "var(--text-secondary)" }}>{v.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section dark>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <SectionLabel text="Our city" light />
          <SectionTitle light>Built in Brisbane. For Brisbane.</SectionTitle>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: "rgba(245,240,235,0.7)", marginBottom: 40 }}>
            Brisbane is one of the fastest-growing cities in Australia. With the 2032 Olympics on the horizon and a booming SMB sector, local businesses have a window to build AI advantage before the market commoditises it. We're here to help you take that window.
          </p>
          <PrimaryButton large onClick={openBooking}>Book a free clarity call</PrimaryButton>
        </div>
      </Section>
    </>
  );
}

// ─── CONTACT PAGE ────────────────────────────────────────────
function ContactPage({ openBooking }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState(null);

  usePageMeta({
    title: "Contact — packading.ai",
    description: "Get in touch with packading.ai. Book a free clarity call or send a message.",
    canonical: "https://packading.ai/contact",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("http://localhost:3001/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch { setStatus("error"); }
  };

  const inputStyle = {
    width: "100%", padding: "14px 16px",
    background: "var(--bone)", border: "1.5px solid rgba(196,114,74,0.2)",
    borderRadius: 6, fontFamily: "var(--font-body)", fontSize: 15,
    color: "var(--brown)", outline: "none", transition: "border-color 0.2s", marginBottom: 16,
  };

  return (
    <>
      <div style={{ background: "var(--charcoal)", paddingTop: 140, paddingBottom: 80, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 40, borderRadius: 24, border: "0.5px solid rgba(196,114,74,0.12)", pointerEvents: "none" }} />
        <Container>
          <SectionLabel text="Contact" light />
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: "clamp(32px, 5vw, 60px)", color: "var(--bone)",
            letterSpacing: "-0.02em", lineHeight: 1.1, maxWidth: 640, marginBottom: 24,
          }}>
            Let's talk about<br />
            <span style={{ color: "var(--terracotta)", fontStyle: "italic" }}>your AI opportunity.</span>
          </h1>
          <p style={{ fontSize: 18, color: "rgba(245,240,235,0.7)", maxWidth: 520, lineHeight: 1.65 }}>
            Book a free 30-minute clarity call, or send us a message and we'll be in touch within one business day.
          </p>
        </Container>
      </div>

      <Section blush>
        <div className="bio-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }}>
          <div>
            <SectionLabel text="Get in touch" />
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 600, color: "var(--charcoal)", marginBottom: 28 }}>We're a message away.</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 40 }}>
              {[
                { label: "Email", value: "hello@packading.ai", href: "mailto:hello@packading.ai" },
                { label: "Location", value: "Brisbane, Queensland, Australia" },
                { label: "Response time", value: "Within 1 business day" },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.14em", color: "var(--terracotta)", textTransform: "uppercase", marginBottom: 6 }}>{item.label}</div>
                  {item.href ? (
                    <a href={item.href} style={{ fontSize: 16, color: "var(--charcoal)", fontWeight: 500, textDecoration: "none" }}>{item.value}</a>
                  ) : (
                    <div style={{ fontSize: 16, color: "var(--charcoal)" }}>{item.value}</div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ background: "var(--bone)", borderRadius: 10, padding: "28px", border: "1px solid rgba(196,114,74,0.12)" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "var(--charcoal)", marginBottom: 12 }}>Book a clarity call</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: 20 }}>
                Free. 30 minutes. We map your AI opportunities and give you an honest next-step recommendation.
              </p>
              <PrimaryButton onClick={openBooking}>Book a free clarity call</PrimaryButton>
            </div>
          </div>

          <div>
            <SectionLabel text="Send a message" />
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 600, color: "var(--charcoal)", marginBottom: 28 }}>Tell us about your business.</h2>
            {status === "done" ? (
              <div style={{ background: "var(--bone)", border: "1px solid rgba(196,114,74,0.2)", borderRadius: 10, padding: 40, textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 16, color: "var(--terracotta)" }}>✦</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--charcoal)", marginBottom: 12 }}>Message received.</h3>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7 }}>We'll be in touch within one business day. If it's urgent, email us directly at hello@packading.ai</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <input style={inputStyle} placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input style={inputStyle} type="email" placeholder="Email address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                <input style={inputStyle} type="tel" placeholder="Phone (optional)" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                <textarea style={{ ...inputStyle, minHeight: 140, resize: "vertical" }} placeholder="Tell us about your business and what you're hoping AI can help with." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
                {status === "error" && <p style={{ fontSize: 13, color: "var(--terracotta)", marginBottom: 16 }}>Something went wrong. Please email us at hello@packading.ai</p>}
                <PrimaryButton style={{ width: "100%" }}>
                  {status === "sending" ? "Sending…" : "Send message"}
                </PrimaryButton>
              </form>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────
function Footer({ setPage }) {
  const cols = [
    {
      heading: "Services",
      links: [
        { label: "AI Readiness Assessment", page: PAGES.services },
        { label: "Strategy Roadmap", page: PAGES.services },
        { label: "Implementation Support", page: PAGES.services },
        { label: "Staff Training", page: PAGES.services },
        { label: "Monthly Retainers", page: PAGES.services },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About", page: PAGES.about },
        { label: "Contact", page: PAGES.contact },
      ],
    },
    {
      heading: "Contact",
      links: [
        { label: "hello@packading.ai", href: "mailto:hello@packading.ai" },
        { label: "Brisbane, QLD", href: null },
      ],
    },
  ];

  return (
    <footer style={{ background: "var(--charcoal)", color: "var(--bone)", padding: "72px 0 40px" }}>
      <Container>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 60 }}>
          <div>
            <BrandLogo height={36} light />
            <p style={{ marginTop: 20, fontSize: 14, lineHeight: 1.75, color: "rgba(245,240,235,0.5)", maxWidth: 280 }}>
              AI packaged for Brisbane's small businesses. Practical, vendor-neutral, results-first.
            </p>
          </div>
          {cols.map((col, i) => (
            <div key={i}>
              <div style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(245,240,235,0.4)", marginBottom: 20 }}>{col.heading}</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                {col.links.map((link, j) => (
                  <li key={j}>
                    {link.href ? (
                      <a href={link.href} style={{ fontSize: 14, color: "rgba(245,240,235,0.65)", textDecoration: "none" }}>{link.label}</a>
                    ) : link.page ? (
                      <button onClick={() => setPage(link.page)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "rgba(245,240,235,0.65)", padding: 0, textAlign: "left" }}>{link.label}</button>
                    ) : (
                      <span style={{ fontSize: 14, color: "rgba(245,240,235,0.65)" }}>{link.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(245,240,235,0.08)", paddingTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <p style={{ fontSize: 13, color: "rgba(245,240,235,0.35)" }}>© {new Date().getFullYear()} packading.ai Pty Ltd · Brisbane, QLD</p>
          <p style={{ fontSize: 13, color: "rgba(245,240,235,0.35)" }}>AI. Packaged for your business.</p>
        </div>
      </Container>
    </footer>
  );
}

// ─── APP ─────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState(PAGES.home);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingProduct, setBookingProduct] = useState(null);

  const openBooking = (product = null) => {
    setBookingProduct(product);
    setBookingOpen(true);
  };

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);

  useJsonLd({
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "packading.ai",
    "description": "AI advisory and implementation agency for Brisbane small businesses",
    "url": "https://packading.ai",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Brisbane",
      "addressRegion": "QLD",
      "addressCountry": "AU",
    },
    "areaServed": "Brisbane, Queensland, Australia",
  });

  return (
    <>
      <style>{globalStyles}</style>
      <NavBar page={page} setPage={setPage} openBooking={openBooking} />

      {page === PAGES.home    && <HomePage    setPage={setPage} openBooking={openBooking} />}
      {page === PAGES.services && <ServicesPage openBooking={openBooking} />}
      {page === PAGES.about   && <AboutPage   openBooking={openBooking} />}
      {page === PAGES.contact && <ContactPage openBooking={openBooking} />}

      <Footer setPage={setPage} />

      {bookingOpen && (
        <BookingModal
          initialProduct={bookingProduct}
          onClose={() => setBookingOpen(false)}
        />
      )}
    </>
  );
}
