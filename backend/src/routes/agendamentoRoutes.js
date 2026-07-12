const express = require('express');
const router = express.Router();
const agendamentoController = require('../controllers/agendamentoController');
const { protegerRota } = require('../middlewares/authMiddleware');

// Ambas as rotas exigem utilizador autenticado via JWT
router.post('/', protegerRota, agendamentoController.criarAgendamento);
router.get('/', protegerRota, agendamentoController.listarAgendamentos);

module.exports = router;