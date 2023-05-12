import { v4 as uuidv4 } from 'uuid';
import { db } from '../dbConnect.js'
import { getCompanyUserFromAccessToken } from './users/getCompanyUserFromAccessToken.js';

export const createEntryCustomer = async (req, res) => {
    try {
        const token = req.headers.authorization;

        const {
            customer_name,
            car_brand,
            car_model,
            car_year,
            car_license_plate,
            process_status,
            cleaning_type,
        } = req.body;

        const id = uuidv4();
        const cod_company = getCompanyUserFromAccessToken(token);
        const created_at = new Date().toISOString();


        const sql = `INSERT INTO car_registration (id, cod_company, customer_name, car_brand, car_model, car_year, car_license_plate, process_status, cleaning_type, created_at) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [id, cod_company, customer_name, car_brand, car_model, car_year, car_license_plate, process_status, cleaning_type, created_at];

        db.run(sql, values, (err) => {

            if (err) {
                console.error(err.message);
                res.status(500).send({
                    message: 'Erro ao inserir dados, formato inválido ou vazio',
                    data: {
                        id,
                        customer_name,
                        car_brand,
                        car_model,
                        car_year,
                        car_license_plate,
                        process_status,
                        cleaning_type,
                        created_at
                    }
                });
                return
            }

            const response = {
                message: 'Cliente criado com sucesso',
                data: {
                    cod_company,
                    id,
                    customer_name,
                    car_brand,
                    car_model,
                    car_year,
                    car_license_plate,
                    process_status,
                    cleaning_type,
                    created_at
                }
            };

            res.status(201).send(response);
        })

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error')
    }
}

export const readCustomerCreated = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const cod_company = getCompanyUserFromAccessToken(token);

        db.all('SELECT * FROM car_registration WHERE cod_company = ? ORDER BY created_at DESC', [cod_company], (err, rows) => {
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

export const updateCustomerCreated = async (req, res) => {
    try {
        const { id } = req.params;
        const token = req.headers.authorization;
        const { customer_name, car_brand, car_model, car_year, car_license_plate, process_status, cleaning_type } = req.body;
        const updated_at = new Date().toISOString();
        const cod_company = getCompanyUserFromAccessToken(token);

        db.run('UPDATE car_registration SET customer_name=?, car_brand=?, car_model=?, car_year=?, car_license_plate=?, process_status=?, cleaning_type=?, updated_at=? WHERE id=? and cod_company=?',
            [customer_name, car_brand, car_model, car_year, car_license_plate, process_status, cleaning_type, updated_at, id, cod_company], function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).send({
                        message: 'Erro ao atualizar os dados, formato inválido ou vazio',
                        data: {
                            cod_company,
                            id,
                            customer_name,
                            car_brand,
                            car_model,
                            car_year,
                            car_license_plate,
                            process_status,
                            cleaning_type,
                        }
                    });
                    return
                }

                if (this.changes === 0) {
                    return res.status(404).send(`ID:${id} inválido ou não encontrado`);
                }

                res.status(200).send({
                    message: 'Cliente alterado com sucesso!',
                    data: {
                        cod_company,
                        id,
                        customer_name,
                        car_brand,
                        car_model,
                        car_year,
                        car_license_plate,
                        process_status,
                        cleaning_type,
                    }
                });
            });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error')
    }
}

export const deleteCustomerCreated = async (req, res) => {
    try {
        const { id } = req.params;
        const token = req.headers.authorization;
        const cod_company = getCompanyUserFromAccessToken(token);

        db.run(`DELETE FROM car_registration WHERE id = ? and cod_company=?`, id, cod_company, function (err) {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Internal Server Error');
            }

            if (this.changes === 0) {
                return res.status(404).send(`Ocorreu um erro, ID: ${id} não encontrado`);
            }

            res.status(200).send(`Cliente com ID: ${id} deletado com sucesso`);
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}
