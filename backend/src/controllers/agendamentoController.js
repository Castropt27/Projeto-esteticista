const prisma = require('../config/prisma');

exports.criarAgendamento = async (req, res, next) => {
    try {
        const { servico_id, funcionario_id, data, observacoes } = req.body;
        const cliente_id = req.user.id; // Retirado automaticamente do Token JWT injetado

        if (!servico_id || !funcionario_id || !data) {
            return res.status(400).json({ success: false, error: 'Dados em falta para efetuar a marcação.' });
        }

        const servico = await prisma.servico.findUnique({ where: { id: servico_id } });
        if (!servico) return res.status(404).json({ success: false, error: 'Serviço não encontrado.' });

        const dataInicio = new Date(data);
        const dataFim = new Date(dataInicio.getTime() + servico.duracao_minutos * 60000);

        const novaMarcacao = await prisma.marcacao.create({
            data: {
                cliente_id,
                funcionario_id,
                servico_id,
                data: dataInicio,
                hora_inicio: dataInicio,
                hora_fim: dataFim,
                preco_total: servico.preco,
                observacoes,
                estado: 'PENDENTE'
            }
        });

        return res.status(201).json({ success: true, message: 'Pedido submetido!', data: novaMarcacao });
    } catch (error) {
        next(error);
    }
};

exports.listarAgendamentos = async (req, res, next) => {
    try {
        let marcacoes;
        
        // Regra de Negócio: Funcionários e clientes só veem os seus próprios dados, Admins veem tudo
        if (req.user.role === 'ADMIN') {
            marcacoes = await prisma.marcacao.findMany({ include: { cliente: true, servico: true } });
        } else if (req.user.role === 'FUNCIONARIO') {
            marcacoes = await prisma.marcacao.findMany({ where: { funcionario_id: req.user.id }, include: { cliente: true, servico: true } });
        } else {
            marcacoes = await prisma.marcacao.findMany({ where: { cliente_id: req.user.id }, include: { servico: true } });
        }

        return res.status(200).json({ success: true, data: marcacoes });
    } catch (error) {
        next(error);
    }
};