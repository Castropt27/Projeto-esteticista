const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const normalizarEmail = (email) => email?.trim().toLowerCase();

const dadosPublicosUtilizador = (user) => ({
    id: user.id,
    nome: user.nome,
    email: user.email,
    telefone: user.telefone,
    role: user.role,
});

exports.registar = async (req, res, next) => {
    try {
        const { nome, password, telefone } = req.body;
        const email = normalizarEmail(req.body.email);

        if (!nome?.trim() || !email || !password) {
            return res.status(400).json({ success: false, error: 'Preencha os campos obrigatórios.' });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, error: 'A password deve ter pelo menos 8 caracteres.' });
        }

        const utilizadorExiste = await prisma.user.findUnique({ where: { email } });
        if (utilizadorExiste) {
            return res.status(400).json({ success: false, error: 'E-mail já se encontra registado.' });
        }

        // Criptografar a password com salt de 10 rounds
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const novoUtilizador = await prisma.user.create({
            data: { nome: nome.trim(), email, password_hash, telefone: telefone?.trim() || null, role: 'CLIENTE' }
        });

        // Gerar o token de autenticação
        const token = jwt.sign({ id: novoUtilizador.id, role: novoUtilizador.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        return res.status(201).json({
            success: true,
            token,
            user: dadosPublicosUtilizador(novoUtilizador),
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { password } = req.body;
        const email = normalizarEmail(req.body.email);

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
            user: dadosPublicosUtilizador(user),
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

exports.atualizarPerfil = async (req, res, next) => {
    try {
        const nome = req.body.nome?.trim();
        const telefone = req.body.telefone?.trim();

        if (!nome) {
            return res.status(400).json({ success: false, error: 'O nome é obrigatório.' });
        }

        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: { nome, telefone: telefone || null },
            select: {
                id: true,
                nome: true,
                email: true,
                telefone: true,
                role: true,
            },
        });

        return res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
};
