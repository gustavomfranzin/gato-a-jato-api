import { TOKEN_ACCOUNTS } from '../../config.js';
import jwt from 'jsonwebtoken';

export const getCompanyUserFromAccessToken = (access_token) => {
    const secretKey = TOKEN_ACCOUNTS;
    try {
        const decoded = jwt.verify(access_token, secretKey);
        const codCompany = decoded.codCompany;
        return codCompany;
    } catch (err) {
        console.error(err);
        return null;
    }
}
