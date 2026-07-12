const jwt = require('jsonwebtoken');

// Middleware para verificar validade do Token JWT
exports.protegerRota = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, error: 'Acesso negado. Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Adiciona os dados descodificados (id, role) ao pedido HTTP
        next();
    } catch (error) {
        return res.status(401).json({ success: false, error: 'Token inválido ou expirado.' });
    }
};

// Middleware dinâmico para autorizar apenas roles específicos
exports.permitirRoles = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.user || !rolesPermitidos.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                error: 'Proibido. O seu nível de acesso não permite esta ação.' 
            });
        }
        next();
    };
};