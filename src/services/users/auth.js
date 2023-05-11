import { db_accounts } from '../../dbConnect.js';
import { TOKEN_REFRESH_ACCOUNTS, TOKEN_ACCOUNTS, EXPIRATION_TOKEN_ACCOUNTS, EXPIRATION_TOKEN_REFRESH_ACCOUNTS } from '../../config.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const loginUser = (req, res) => {
    const { username, password } = req.body;

    db_accounts.get('SELECT id, username, password FROM users WHERE username=?', [username], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).send({
                message: 'Erro ao ler o usuário',
                data: {
                    username
                }
            });
            return
        }
        if (!row) {
            res.status(401).send('Usuário não encontrado');
        } else {
            const passwordMatch = bcrypt.compareSync(password, row.password);

            if (passwordMatch) {
                const accessToken = jwt.sign({ userId: row.id }, `${TOKEN_ACCOUNTS}`, { expiresIn: `${EXPIRATION_TOKEN_ACCOUNTS}` });
                const refreshToken = jwt.sign({ userId: row.id }, `${TOKEN_REFRESH_ACCOUNTS}`, { expiresIn: `${EXPIRATION_TOKEN_REFRESH_ACCOUNTS}` });

                db_accounts.run('UPDATE users SET access_token=?, refresh_token=? WHERE id=?', [accessToken, refreshToken, row.id], (err) => {
                    if (err) {
                        console.error(err.message);
                        res.status(500).send('Erro ao salvar os tokens');
                    } else {
                        res.status(200).json({
                            message: 'Usuário autenticado com sucesso',
                            access_token: accessToken,
                            refresh_token: refreshToken
                        });
                    }
                });

            } else {
                res.status(401).send('Usuário ou senha inválidos');
            }
        }
    })
}

export const refreshTokens = (req, res) => {
    const refreshToken = req.body.refresh_token;

    if (!refreshToken) {
        return res.status(400).send('Token de atualização não fornecido');
    }

    jwt.verify(refreshToken, TOKEN_REFRESH_ACCOUNTS, (err, decoded) => {
        if (err) {
            console.error(err);
            return res.status(401).send('Token de atualização inválido');
        }

        const userId = decoded.userId;

        db_accounts.get('SELECT id, access_token FROM users WHERE id=?', [userId], (err, row) => {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Erro ao verificar o usuário');
            }

            if (!row) {
                return res.status(401).send('Usuário não encontrado');
            }

            const accessToken = row.access_token;

            // Verifique se o token de acesso atual está expirado
            jwt.verify(accessToken, TOKEN_ACCOUNTS, (err) => {
                if (err) {
                    // O token de acesso está expirado, gere um novo token de acesso
                    const newAccessToken = jwt.sign({ userId: row.id }, TOKEN_ACCOUNTS, { expiresIn: `${EXPIRATION_TOKEN_ACCOUNTS}` });

                    db_accounts.run('UPDATE users SET access_token=? WHERE id=?', [newAccessToken, userId], (err) => {
                        if (err) {
                            console.error(err.message);
                            return res.status(500).send('Erro ao atualizar o token de acesso');
                        }

                        res.status(200).json({
                            message: 'Token atualizado',
                            access_token: newAccessToken
                        });
                    });
                } else {
                    // O token de acesso atual não está expirado, retorne o mesmo token
                    res.status(200).json({
                        message: 'Token dentro da validade',
                        access_token: accessToken
                    });
                }
            });
        });
    });
};


