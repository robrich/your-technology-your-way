import { Request, Response } from 'express';
import Router from 'express-promise-router';
import { VersionData } from '../types/VersionData';

const router = Router();

router.get('/', async function(req: Request, res: Response) {
  const version: VersionData = {
    language: 'TypeScript',
    runtime: 'Express',
    version: process.version.toString()
  }
  res.json(version);
});

export default router;
