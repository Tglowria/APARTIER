const express = require('express');
const { authenticateJWT, authorizeRoles } = require('../middleware/authmiddleware.js');
const { upload } = require('../middleware/multerConfig.js');
const { bookShortlet, getAllAvailableShortlets, create, filterShortletsByState, getAllShortlets } = require( '../controller/shortletController.js');

const router = express.Router();

router.get('/available', authenticateJWT, getAllAvailableShortlets);
router.post('/', authenticateJWT, authorizeRoles('ROLE_ADMIN'), upload.array('images', 2), create);
router.post('/book', authenticateJWT, bookShortlet);
router.get('/state', authenticateJWT, filterShortletsByState);
router.get('/', authenticateJWT, getAllShortlets);

module.exports = router
