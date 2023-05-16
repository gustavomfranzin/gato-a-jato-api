import { db_tokens } from "../../dbConnect.js";
import { decodeToken } from "./decodeToken.js";

export const logoutUser = (req, res) => {
    const token = req.headers.authorization;
    const refreshToken = req.headers.refresh_token;

    const decodedToken = decodeToken(token);
    const userId = decodedToken.userId;
    const codCompany = decodedToken.codCompany;
    const company = decodedToken.company;
    const created_at = new Date().toISOString();

    const sql = 'INSERT INTO tokens_disabled(user_id, cod_company, company, access_token_disabled, refresh_token_disabled, created_at) VALUES (?,?,?,?,?,?)'
    const values = [userId, codCompany, company, token, refreshToken, created_at];

    try {
        db_tokens.run(sql, values, (err) => {

            if (err) {
                console.error(err.message);
                return res.status(500).send({
                    success: false,
                    error: true,
                    message: 'falha ao inserir token',
                    data: {
                        token,
                        refreshToken,
                        created_at
                    }
                });
            }

            const response = {
                success: true,
                error: false,
                message: 'token desabilitado com sucesso',
                data: {
                    token,
                    refreshToken,
                    created_at
                }
            };

            return res.status(201).send(response);
        })
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server Error')
    }
}

export const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id FROM tokens_disabled WHERE access_token_disabled=?'


        try {
            db_tokens.get(sql, token, (err, row) => {
                if (err) {
                    console.error(err.message);
                    const errorResponse = {
                        success: false,
                        error: true,
                        message: 'Erro ao carregar os dados',
                    };
                    reject(errorResponse);
                }
                if (!row) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        } catch (err) {
            console.error(err);
            return res.status(500).send('Server Error')
        }
    })
}


