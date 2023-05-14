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

    const sql = 'SELECT id FROM users WHERE username = ? OR email = ?';
    try {
        db_accounts.get(sql, [username, email], (err, row) => {
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
                return res.status(409).send({
                    success: false,
                    error: true,
                    message: 'Usuário já existe',
                    data: {
                        username,
                    }
                })
            }

            //autoincrement do cod_company, sqlite3 não permite autoincrement em dois campos
            function generateRandomNumber() {
                return Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
            }

            const codCompany = generateRandomNumber();

            const salt = bcrypt.genSaltSync(10);

            const hashedPassword = bcrypt.hashSync(password, salt);

            const permissions = 'root';

            const role = 'owner';

            const sql = 'INSERT INTO users (cod_company, company, username, email, password, role, full_name, date_of_birth, phone_number, permissions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

            db_accounts.run(sql, [codCompany, company, username, email, hashedPassword, role, full_name, date_of_birth, phone_number, permissions], function (err) {
                if (err) {
                    console.error(err.message);
                    return res.status(500).send({
                        success: false,
                        error: true,
                        message: 'Erro ao criar usuário, formato inválido ou vazio',
                        data: {
                            username,
                            email,
                            full_name,
                            date_of_birth,
                            phone_number
                        }
                    });
                }

                const response = {
                    success: true,
                    error: false,
                    message: 'Usuário criado com sucesso',
                    data: {
                        codCompany,
                        company,
                        username,
                        email,
                        full_name,
                        date_of_birth,
                        phone_number,
                        permissions,
                    }
                }

                return res.status(201).send(response);
            });
        })
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server Error')
    }
}
