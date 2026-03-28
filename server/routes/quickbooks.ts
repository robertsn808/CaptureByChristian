
import { Router } from 'express';
import { quickbooksAuth, quickbooksCallback } from '../quickbooks';

const router = Router();

router.get('/auth', quickbooksAuth);
router.get('/callback', quickbooksCallback);

export default router;
