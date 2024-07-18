const express = require('express');
const { authenticateJWT, authorizeRoles } = require('../middleware/authmiddleware.js');
const { upload } = require('../middleware/multerConfig.js');
const { getShortlets, createShortlet, bookShortlet, countShortlets } = require( '../controller/shortletController.js');

const router = express.Router();

router.get('/', authenticateJWT, getShortlets);
router.post('/', authenticateJWT, authorizeRoles('ROLE_ADMIN'), upload.array('images', 2), createShortlet);
router.post('/:id/book', authenticateJWT, bookShortlet);
router.get('/count', authenticateJWT, countShortlets);

module.exports = router
