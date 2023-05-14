import { TOKEN_ACCOUNTS } from '../../config.js';
import jwt from 'jsonwebtoken';

export const decodeToken = (access_token) => {
    try {
        const decoded = jwt.verify(access_token, TOKEN_ACCOUNTS);
        return decoded;
    } catch (err) {
        console.error(err);
        return null;
    }
}
