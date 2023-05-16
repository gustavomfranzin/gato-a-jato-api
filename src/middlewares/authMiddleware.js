import jwt from 'jsonwebtoken';
import { TOKEN_ACCOUNTS } from '../config.js';
import { verifyToken } from '../services/users/logout.js';

export const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;

    const isValidToken = await verifyToken(token);

    if (!isValidToken) {
        return res.status(401).json({ message: 'Token de acesso não expirado' });
    }

    if (!token || token === 'null') {
        return res.status(401).json({ message: 'Token de acesso não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, TOKEN_ACCOUNTS);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Token de acesso inválido' });
    }
};
