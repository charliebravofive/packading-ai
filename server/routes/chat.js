const express = require('express');
const router = express.Router();

// ─── FAQ KNOWLEDGE BASE ───────────────────────────────────────
const FAQ_DATA = [
  // Getting started
  { keywords: ['start', 'begin', 'first step', 'where do i', 'how do i start', 'get started', 'new', 'beginning'],
    q: 'How do I get started?',
    a: 'The best first step is a free 30-minute Clarity Call. We map your workflows, find your biggest AI opportunities, and give you an honest assessment — no sales pitch. Book at packading.ai or reply "book" below.' },

  { keywords: ['clarity call', 'free call', '30 min', '30-min', 'what is a clarity call', 'what happens'],
    q: 'What is a Clarity Call?',
    a: 'A free 30-minute video or phone call where we audit your current workflows, identify your biggest time and cost drains, and give you an honest AI action plan. You leave with clarity — even if you never work with us.' },

  { keywords: ['cost', 'price', 'pricing', 'how much', 'fee', 'rates', 'expensive', 'affordable', 'cheap'],
    q: 'What does it cost?',
    a: 'The Clarity Call is free. Beyond that: AI Readiness Assessment from $1,800 · Custom Strategy Roadmap from $4,500 · Implementation from $3,500 · Retainers from $800/month. All fixed-price — no surprise invoices.' },

  { keywords: ['industry', 'sector', 'type of business', 'work with', 'trades', 'retail', 'health', 'professional', 'construction'],
    q: 'What industries do you work with?',
    a: 'We work with trades & construction, retail & e-commerce, allied health, professional services, hospitality, and real estate. If you have repetitive admin, you have AI opportunity. We have industry-specific playbooks for each.' },

  { keywords: ['how long', 'timeline', 'results', 'timeframe', 'how quickly', 'fast', 'soon', 'weeks'],
    q: 'How long before I see results?',
    a: 'Most clients save 5–10 hours per week within 60 days of first implementation. The Clarity Call and Readiness Assessment usually identify at least 3 quick wins you can action immediately — before any major project.' },

  { keywords: ['different', 'why you', 'other consultants', 'enterprise', 'big firms', 'vs', 'compare', 'unique', 'special'],
    q: 'How are you different from other AI consultants?',
    a: "We're local (Brisbane-based, in-person available), vendor-neutral (zero commissions from any software company), fixed-price (no scope creep), and small-business focused. You talk to the same person every time — not a rotating junior team." },

  { keywords: ['safe', 'security', 'data', 'privacy', 'gdpr', 'privacy act', 'secure', 'confidential', 'protect'],
    q: 'Is my business data safe?',
    a: 'Yes. We only recommend tools with Australian data residency or strong Privacy Act compliance. We never access your data directly — we advise on tools and implementations that you control at all times.' },

  { keywords: ['vendor', 'commission', 'neutral', 'bias', 'kickback', 'software', 'which tool'],
    q: 'What does vendor-neutral mean?',
    a: "We don't earn commissions from any software vendor. Our only incentive is recommending what's right for your business. If the best tool for you is a free one, that's what we'll recommend." },

  { keywords: ['retainer', 'ongoing', 'monthly', 'support', 'cancel', 'lock in', 'contract', 'commitment'],
    q: 'How do retainers work?',
    a: 'All retainers are month-to-month — no lock-in contracts. 30 days notice to cancel. Starter ($800/mo) suits 1–5 staff, Growth ($1,800/mo) suits 6–20 staff, Scale ($3,500/mo) for 21–50 staff. Most clients stay 24+ months because they keep seeing results.' },

  { keywords: ['brisbane', 'local', 'location', 'based', 'office', 'meet', 'in person', 'face to face', 'visit'],
    q: 'Are you based in Brisbane?',
    a: "Yes — we're 100% Brisbane-based. Face-to-face visits are available for clients in South East Queensland. We're embedded in the local business community and accountable to it." },

  { keywords: ['readiness assessment', 'assessment', 'audit', 'report', 'analysis'],
    q: 'What is the AI Readiness Assessment?',
    a: 'A 2–3 session deep-dive into your business that produces a 20-page AI Readiness Report. We audit your current tools, map every automation opportunity ranked by ease and ROI, and give you vendor-neutral recommendations. From $1,800.' },

  { keywords: ['small business', 'sme', 'smb', 'size', 'staff', 'employees', 'too small', 'big enough'],
    q: 'Are you suitable for small businesses?',
    a: "Absolutely — that's exactly who we're built for. We work with businesses from 1 to 50 staff. The Starter Retainer and Clarity Call are specifically designed for smaller operations. No enterprise price tags." },

  { keywords: ['implement', 'setup', 'build', 'integrate', 'install', 'deploy', 'configure'],
    q: 'Do you help with implementation?',
    a: "Yes. We don't just hand you a plan and disappear. Our Implementation & Integration service handles automation setup (n8n, Make, Zapier), AI tool configuration, staff training, and 30-day post-implementation support. From $3,500." },

  { keywords: ['training', 'staff', 'team', 'workshop', 'learn', 'education', 'upskill'],
    q: 'Do you offer staff training?',
    a: 'Yes — hands-on, role-specific AI workshops. Half-day ($900) or full-day ($1,800). We teach your team to use AI in their actual jobs, not a generic ChatGPT intro. Includes take-home reference guides and a 30-min follow-up Q&A.' },

  { keywords: ['contact', 'email', 'phone', 'reach', 'get in touch', 'hello', 'message'],
    q: 'How do I contact you?',
    a: 'Email: hello@packading.ai · Or book a free Clarity Call directly from the website. We respond within 1 business day.' },
];

// Fallback responses
const FALLBACK_RESPONSES = [
  "Great question — that's something we'd cover in detail on a free Clarity Call. It takes 30 minutes and there's no obligation. Want to book one?",
  "That's worth a proper conversation. Our free Clarity Call is the best way to get a specific answer for your business. Can I help you book one?",
  "I want to give you an accurate answer rather than a generic one. A free 30-min Clarity Call with our team would cover exactly this — zero obligation. Want to book?",
];

const GREETINGS = ['hi', 'hello', 'hey', 'g\'day', 'good morning', 'good afternoon', 'howdy'];
const BOOK_TRIGGERS = ['book', 'schedule', 'appointment', 'call', 'clarity call', 'yes please', 'book now', 'reserve'];

function findBestAnswer(message) {
  const lower = message.toLowerCase().trim();

  // Greeting
  if (GREETINGS.some(g => lower === g || lower.startsWith(g + ' ') || lower.startsWith(g + ','))) {
    return {
      text: "G'day! I'm the packading.ai assistant. I can answer questions about our AI advisory services for Brisbane businesses. What would you like to know?",
      showBook: false,
    };
  }

  // Book trigger
  if (BOOK_TRIGGERS.some(t => lower.includes(t))) {
    return {
      text: "Brilliant — book your free 30-minute Clarity Call here: you'll find a date that works for you in under 2 minutes.",
      showBook: true,
    };
  }

  // Score FAQ matches
  let bestScore = 0;
  let bestFaq = null;
  for (const faq of FAQ_DATA) {
    const score = faq.keywords.filter(kw => lower.includes(kw)).length;
    if (score > bestScore) { bestScore = score; bestFaq = faq; }
  }

  if (bestFaq && bestScore > 0) {
    return { text: bestFaq.a, showBook: true };
  }

  // Fallback
  const fallback = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
  return { text: fallback, showBook: true };
}

// POST /api/chat
router.post('/', (req, res) => {
  const { message } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message is required' });
  }
  const result = findBestAnswer(message.trim().slice(0, 500));
  res.json(result);
});

module.exports = router;
