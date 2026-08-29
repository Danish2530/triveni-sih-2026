import express from 'express';
import { getGovernmentDashboardData } from '../controllers/governmentController.js';

const router = express.Router();

router.get('/government', getGovernmentDashboardData);

export default router;
