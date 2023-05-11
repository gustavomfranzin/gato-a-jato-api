import jwt from 'jsonwebtoken';
import { TOKEN_ACCOUNTS } from '../config.js'

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    jwt.verify(token, `${TOKEN_ACCOUNTS}`, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido ou expirado' });
        }

        req.userId = decoded.userId;
        next();
    });
};
