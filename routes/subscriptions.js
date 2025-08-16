const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Subscriptions endpoint working' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Subscription created', data: req.body });
});

module.exports = router;
