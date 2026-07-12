const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const agendamentoRoutes = require('./agendamentoRoutes');

router.get('/health', (req, res) => res.json({ status: 'OK', date: new Date() }));

router.use('/auth', authRoutes);
router.use('/agendamentos', agendamentoRoutes);

module.exports = router;