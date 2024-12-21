
import express from 'express';
const router = express.Router();
import authRouter from './auth/index.ts';

router.use('/auth' , authRouter);


export default router;

module.exports = router;