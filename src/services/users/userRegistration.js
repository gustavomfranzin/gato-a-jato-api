import { db_accounts } from '../../dbConnect.js';
import bcrypt from 'bcryptjs';


export const createUserLogin = async (req, res) => {
    const {
        username,
        email,
        password,
        full_name,
        date_of_birth,
        phone_number,
    } = req.body;

    try {
        const salt = bcrypt.genSaltSync(10);

        const hashedPassword = bcrypt.hashSync(password, salt);

        const sql = 'INSERT INTO users (username, email, password, full_name, date_of_birth, phone_number) VALUES (?, ?, ?, ?, ?, ?)';

        db_accounts.run(sql, [username, email, hashedPassword, full_name, date_of_birth, phone_number], function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).send({
                    message: 'Erro ao criar usuário, formato inválido ou vazio',
                    data: {
                        username,
                        email,
                        full_name,
                        date_of_birth,
                        phone_number
                    }
                });
                return
            }

            const response = {
                message: 'Usuário criado com sucesso',
                data: {
                    username,
                    email,
                    full_name,
                    date_of_birth,
                    phone_number
                }
            }

            res.status(201).send(response);
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error')
    }
}

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
            console.log(row)
            res.status(401).send('Usuário não encontrado');
        } else {
            const passwordMatch = bcrypt.compareSync(password, row.password);
            console.log(passwordMatch);
            if (passwordMatch) {
                const accessToken = jwt.sign({ userId: row.id }, `${TOKEN_ACCOUTNS}`, { expiresIn: '30m' });
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
