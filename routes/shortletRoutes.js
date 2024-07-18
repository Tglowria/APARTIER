import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from '../middleware/authmiddleware.js';
import { upload } from '../middleware/multerConfig.js';
import { getShortlets, createShortlet, bookShortlet, countShortlets } from '../controller/shortletController.js';

const router = Router();

router.get('/', authenticateJWT, getShortlets);
router.post('/', authenticateJWT, authorizeRoles('ROLE_ADMIN'), upload.array('images', 2), createShortlet);
router.post('/:id/book', authenticateJWT, bookShortlet);
router.get('/count', authenticateJWT, countShortlets);

export default router;
