const express = require('express');

const router = express.Router();

// POST /api/contact { name, email, subject, message }
// Wired to log for now — swap in an email/CRM integration
// (e.g. nodemailer, a helpdesk API) without changing the frontend contract.
router.post('/', async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      const err = new Error('Name, email, subject and message are all required.');
      err.status = 400;
      throw err;
    }
    console.log('New contact form submission:', { name, email, subject });
    res.status(201).json({ received: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
