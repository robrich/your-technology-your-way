const express = require('express');
const router = express.Router();
const orderRepository = require('../data/order-repository');

router.get('/', async function(req, res) {
  const orders = await orderRepository.getAll();
  res.json(orders);
});

router.post('/', async function(req, res) {
  if (!req.body || !req.body.description) {
    return res.status(400).end();
  }
  const id = await orderRepository.add({order:req.body});
  res.status(201).end();
});

module.exports = router;
