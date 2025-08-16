const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Invoices endpoint working' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Invoice created', data: req.body });
});

module.exports = router;
