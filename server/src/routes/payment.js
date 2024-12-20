// server/src/routes/payment.js
const express = require('express');
const router = express.Router();
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/payment/charge
// request body 예시: { amount: 2000, currency: 'usd', payment_method: 'pm_xxx' }
router.post('/charge', async (req, res) => {
  try {
    const { amount, currency, payment_method } = req.body;
    if (!amount || !currency || !payment_method) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method,
      confirm: true, // 바로 결제 시도
    });

    // 결제 성공 시 응답
    return res.json({ message: 'Payment successful', paymentIntentId: paymentIntent.id });
  } catch (error) {
    console.error('Payment error:', error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
