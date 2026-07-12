const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registar = async (req, res, next) => {
    try {
        const { nome, email, password, telefone } = req.body;

        if (!nome || !email || !password) {
            return res.status(400).json({ success: false, error: 'Preencha os campos obrigatórios.' });
        }

        const utilizadorExiste = await prisma.user.findUnique({ where: { email } });
        if (utilizadorExiste) {
            return res.status(400).json({ success: false, error: 'E-mail já se encontra registado.' });
        }

        // Criptografar a password com salt de 10 rounds
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const novoUtilizador = await prisma.user.create({
            data: { nome, email, password_hash, telefone, role: 'CLIENTE' }
        });

        // Gerar o token de autenticação
        const token = jwt.sign({ id: novoUtilizador.id, role: novoUtilizador.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        return res.status(201).json({
            success: true,
            token,
            user: {
                id: novoUtilizador.id,
                nome: novoUtilizador.nome,
                email: novoUtilizador.email,
                telefone: novoUtilizador.telefone,
                role: novoUtilizador.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'E-mail e password são necessários.' });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ success: false, error: 'Credenciais inválidas.' });
        }

        if (!user.ativo) {
            return res.status(403).json({ success: false, error: 'Esta conta encontra-se desativada.' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        return res.status(200).json({
            success: true,
            token,
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                telefone: user.telefone,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

exports.me = async (req, res, next) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, error: 'Utilizador não autenticado.' });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                nome: true,
                email: true,
                telefone: true,
                role: true,
            },
        });

        if (!user) {
            return res.status(404).json({ success: false, error: 'Utilizador não encontrado.' });
        }

        return res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
};