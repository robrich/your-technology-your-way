import Router from 'express-promise-router';

const router = Router();

router.get('/', async function(req, res) {
  const version = {
    language: 'JavaScript',
    runtime: 'Express',
    version: process.version.toString()
  }
  res.json(version);
});

export default router;
