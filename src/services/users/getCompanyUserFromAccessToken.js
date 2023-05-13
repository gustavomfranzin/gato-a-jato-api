import { TOKEN_ACCOUNTS } from '../../config.js';
import jwt from 'jsonwebtoken';

export const getCompanyUserFromAccessToken = (access_token) => {
    try {
        const decoded = jwt.verify(access_token, TOKEN_ACCOUNTS);
        const codCompany = decoded.codCompany;
        return codCompany;
    } catch (err) {
        console.error(err);
        return null;
    }
}
