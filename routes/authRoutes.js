import { Router } from 'express';
import passport from 'passport';
import { googleAuth, googleAuthCallback } from '../controller/authController.js';

const router = Router();

router.get('/google', googleAuth);
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), googleAuthCallback);

export default router;
