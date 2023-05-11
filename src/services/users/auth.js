import { db_accounts } from '../../dbConnect.js';
import { TOKE_REFRESH_ACCOUNTS, TOKEN_ACCOUNTS } from '../../config.js'
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
            console.log(passwordMatch);
            if (passwordMatch) {
                const accessToken = jwt.sign({ userId: row.id }, `${TOKEN_ACCOUNTS}`, { expiresIn: '30m' });
                const refreshToken = jwt.sign({ userId: row.id }, `${TOKE_REFRESH_ACCOUNTS}`, { expiresIn: '7d' });

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
