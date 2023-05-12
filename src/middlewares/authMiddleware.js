import jwt from 'jsonwebtoken';
import { TOKEN_ACCOUNTS } from '../config.js';

const secretKey = TOKEN_ACCOUNTS;

export const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Token de acesso não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded.user; // Armazena as informações do usuário decodificadas no objeto de requisição (req.user)
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Token de acesso inválido' });
    }
};
