import { db } from '../../dbConnect.js';
import bcrypt from 'bcryptjs';
import { decodeToken } from '../users/decodeToken.js';

export const createEmployeesUser = async (req, res) => {
    const token = req.headers.authorization;
    const decodedToken = decodeToken(token);
    const codCompany = decodedToken.codCompany;
    const company = decodedToken.company;

    const {
        username,
        password,
        email,
        full_name,
        date_of_birth,
        phone_number,
        role,
        permissions
    } = req.body;

    const sql = 'SELECT id FROM employees WHERE username =? and cod_company=?';
    try {
        db.get(sql, [username, codCompany], (err, row) => {
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
                    message: 'Usuário já existem',
                    data: {
                        username,
                    }
                })
                return;
            }

            const salt = bcrypt.genSaltSync(10);

            const hashedPassword = bcrypt.hashSync(password, salt);

            const sql = 'INSERT INTO employees (cod_company, company, username, email, password, role, full_name, date_of_birth, phone_number, permissions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

            db.run(sql, [codCompany, company, username, email, hashedPassword, role, full_name, date_of_birth, phone_number, permissions], function (err) {
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
                        codCompany,
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
