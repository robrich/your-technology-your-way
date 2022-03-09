import { Request, Response } from 'express';
import Router from 'express-promise-router';
import { getAll, add } from '../data/order-repository';
import { Order } from '../types/Order';

const router = Router();

router.get('/', async function(req: Request, res: Response) {
  const orders = await getAll();
  res.json(orders);
});

router.post('/', async function(req: Request, res: Response) {
  const order: Order = req.body;
  if (!order?.description) {
    return res.status(400).end();
  }
  const id = await add({order});
  res.status(201).end();
});

export default router;
