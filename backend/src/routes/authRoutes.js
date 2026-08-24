const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protegerRota } = require('../middlewares/authMiddleware');

router.post('/registar', authController.registar);
router.post('/login', authController.login);
router.get('/me', protegerRota, authController.me);
router.put('/me', protegerRota, authController.atualizarPerfil);

module.exports = router;
