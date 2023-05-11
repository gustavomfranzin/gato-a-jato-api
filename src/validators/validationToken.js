import jwt from 'jsonwebtoken';
import { TOKEN_ACCOUTNS } from '../config.js'

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    console.log(token)
    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    jwt.verify(token, `${TOKEN_ACCOUTNS}`, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }

        req.userId = decoded.userId;
        next();
    });
};
