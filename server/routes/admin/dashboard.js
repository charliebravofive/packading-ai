const express = require('express');
const router = express.Router();
const store = require('../../store');

const PRICES = { 'clarity-call': 0, 'assessment-deposit': 1800, 'retainer-starter': 800 };

function getPrice(product_id) {
  if (!product_id) return 0;
  const key = String(product_id).toLowerCase();
  return PRICES[key] ?? 0;
}

router.get('/', (req, res) => {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const sevenDaysLater = new Date(now);
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
  const sevenDaysStr = sevenDaysLater.toISOString().split('T')[0];

  const monthStr = now.toISOString().slice(0, 7); // "YYYY-MM"

  const allBookings = store.bookings.list();
  const allClients = store.clients.list();
  const allGiftCards = store.giftCards.list();
  const allEnquiries = store.enquiries.list();

  // Upcoming sessions: next 7 days confirmed bookings
  const upcoming_sessions = allBookings
    .filter(b =>
      b.status === 'confirmed' &&
      b.session_date >= todayStr &&
      b.session_date <= sevenDaysStr
    )
    .sort((a, b) => a.session_date.localeCompare(b.session_date))
    .map(b => ({
      id: b.id,
      name: b.name,
      email: b.email,
      session_date: b.session_date,
      session_time: b.session_time,
      product_id: b.product_id,
    }));

  // Sessions this month: confirmed bookings in current calendar month
  const sessions_this_month = allBookings.filter(b =>
    b.status === 'confirmed' &&
    b.session_date &&
    b.session_date.startsWith(monthStr)
  ).length;

  // Revenue this month: sum based on product prices
  const revenue_this_month = allBookings
    .filter(b =>
      b.status === 'confirmed' &&
      b.session_date &&
      b.session_date.startsWith(monthStr)
    )
    .reduce((sum, b) => sum + getPrice(b.product_id), 0);

  // Active gift cards
  const activeCards = allGiftCards.filter(g =>
    g.sessions_remaining > 0 && g.status !== 'voided'
  );
  const active_gift_cards = activeCards.length;
  const gift_card_liability = activeCards.reduce((sum, g) => sum + (g.sessions_remaining || 0), 0);

  // New clients this month
  const new_clients_this_month = allClients.filter(c =>
    c.created_at && c.created_at.startsWith(monthStr)
  ).length;

  // New enquiries
  const new_enquiries = allEnquiries.filter(e => e.status === 'new').length;

  // Period report (optional ?from=YYYY-MM-DD&to=YYYY-MM-DD)
  let period = null;
  const { from, to } = req.query;
  if (from || to) {
    const periodBookings = allBookings.filter(b => {
      if (!b.session_date) return false;
      if (['cancelled', 'no-show'].includes(b.status)) return false;
      if (from && b.session_date < from) return false;
      if (to && b.session_date > to) return false;
      return true;
    });

    let bookings_clarity = 0, bookings_assessment = 0, bookings_retainer = 0;
    let revenue_stripe = 0, revenue_gift_card = 0;

    periodBookings.forEach(b => {
      const key = String(b.product_id || '').toLowerCase();
      const price = getPrice(b.product_id);
      if (key.includes('assessment')) bookings_assessment++;
      else if (key.includes('retainer')) bookings_retainer++;
      else bookings_clarity++;

      if (b.payment_method === 'gift_card' || b.payment_method === 'gift-card') {
        revenue_gift_card += price;
      } else {
        revenue_stripe += price;
      }
    });

    period = {
      bookings_clarity,
      bookings_assessment,
      bookings_retainer,
      revenue_stripe,
      revenue_gift_card,
      total_revenue: revenue_stripe + revenue_gift_card,
    };
  }

  res.json({
    upcoming_sessions,
    sessions_this_month,
    revenue_this_month,
    active_gift_cards,
    gift_card_liability,
    new_clients_this_month,
    new_enquiries,
    ...(period !== null ? { period } : {}),
  });
});

module.exports = router;
