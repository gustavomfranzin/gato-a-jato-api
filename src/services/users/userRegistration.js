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

export const getUsers = (req, res) => {

    try {
        db_accounts.all('SELECT * FROM users ORDER BY created_at desc', [], (err, rows) => {
            if (err) {
                console.error(err.message);
                res.status(500).send('Não foi possível carregar os dados');
            }

            res.status(200).send(rows);

            return rows;
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error')
    }


}
