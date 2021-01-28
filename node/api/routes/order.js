import Router from 'express-promise-router';
import { getAll, add } from '../data/order-repository.js';

const router = Router();

router.get('/', async function(req, res) {
  const orders = await getAll();
  res.json(orders);
});

router.post('/', async function(req, res) {
  if (!req.body || !req.body.description) {
    return res.status(400).end();
  }
  const id = await add({order:req.body});
  res.status(201).end();
});

export default router;
