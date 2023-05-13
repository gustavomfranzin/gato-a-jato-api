import { db_accounts } from '../../dbConnect.js';
import bcrypt from 'bcryptjs';

export const createUserLogin = async (req, res) => {
    const {
        company,
        username,
        email,
        password,
        full_name,
        date_of_birth,
        phone_number,
    } = req.body;

    try {
        db_accounts.get('SELECT id FROM users WHERE username = ? OR email = ?', [username, email], (err, row) => {
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
            if (row) {
                res.status(409).send({
                    message: 'Usuário ou e-mail já existem',
                    data: {
                        username,
                        email
                    }
                })
                return;
            }

            //autoincrement do cod_company, sqlite3 não permite autoincrement em dois campos
            function generateRandomNumber() {
                return Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
            }

            const cod_company = generateRandomNumber();

            const salt = bcrypt.genSaltSync(10);

            const hashedPassword = bcrypt.hashSync(password, salt);

            const permissions = 'root';

            const role = 'owner';

            const sql = 'INSERT INTO users (cod_company, company, username, email, password, role, full_name, date_of_birth, phone_number, permissions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

            db_accounts.run(sql, [cod_company, company, username, email, hashedPassword, role, full_name, date_of_birth, phone_number, permissions], function (err) {
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
                        cod_company,
                        company,
                        username,
                        email,
                        password,
                        role,
                        full_name,
                        date_of_birth,
                        phone_number,
                        permissions,
                    }
                }
                res.status(201).send(response);
            });
        })
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error')
    }
}
