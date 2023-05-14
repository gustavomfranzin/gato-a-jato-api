import jwt from 'jsonwebtoken';
import { TOKEN_ACCOUNTS } from '../config.js';

export const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

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
