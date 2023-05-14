import { v4 as uuidv4 } from 'uuid';
import { db } from '../dbConnect.js'
import { decodeToken } from './users/decodeToken.js';

export const createEntryCustomer = async (req, res) => {
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
    const decodedToken = decodeToken(token);
    const codCompany = decodedToken.codCompany;
    const created_at = new Date().toISOString();

    const sql = `INSERT INTO car_registration (id, cod_company, customer_name, car_brand, car_model, car_year, car_license_plate, process_status, cleaning_type, created_at) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [id, codCompany, customer_name, car_brand, car_model, car_year, car_license_plate, process_status, cleaning_type, created_at];
    try {
        db.run(sql, values, (err) => {

            if (err) {
                console.error(err.message);
                return res.status(500).send({
                    success: false,
                    error: true,
                    message: 'Falha ao realizar o cadastro do cliente',
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
            }

            const response = {
                success: true,
                error: false,
                message: 'Cliente criado com sucesso',
                data: {
                    codCompany,
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

            return res.status(201).send(response);
        })

    } catch (err) {
        console.error(err);
        return res.status(500).send('Server Error')
    }
}

export const readCustomerCreated = async (req, res) => {
    const token = req.headers.authorization;
    const decodedToken = decodeToken(token);
    const codCompany = decodedToken.codCompany;

    const sql = 'SELECT * FROM car_registration WHERE cod_company = ? ORDER BY created_at DESC';
    try {
        db.all(sql, [codCompany], (err, rows) => {
            if (err) {
                console.error(err.message);
                return res.status(500).send({
                    success: false,
                    error: true,
                    message: 'erro ao carregar os dados'
                });
            }

            return res.status(200).send(rows);
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server Error')
    }
}

export const updateCustomerCreated = async (req, res) => {
    const { id } = req.params;
    const token = req.headers.authorization;
    const { customer_name, car_brand, car_model, car_year, car_license_plate, process_status, cleaning_type } = req.body;
    const updated_at = new Date().toISOString();
    const decodedToken = decodeToken(token);
    const codCompany = decodedToken.codCompany;

    const sql = 'UPDATE car_registration SET customer_name=?, car_brand=?, car_model=?, car_year=?, car_license_plate=?, process_status=?, cleaning_type=?, updated_at=? WHERE id=? and cod_company=?';
    try {
        db.run(sql,
            [customer_name, car_brand, car_model, car_year, car_license_plate, process_status, cleaning_type, updated_at, id, codCompany], function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).send({
                        success: false,
                        error: true,
                        message: 'Falha ao atualizar os dados',
                        data: {
                            codCompany,
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
                }

                if (this.changes === 0) {
                    return res.status(404).send({
                        success: false,
                        error: true,
                        message: `Ocorreu um erro, ID: ${id} não encontrado`
                    });
                }
                const response = {
                    success: true,
                    error: false,
                    message: 'Cliente alterado com sucesso!',
                    data: {
                        codCompany,
                        id,
                        customer_name,
                        car_brand,
                        car_model,
                        car_year,
                        car_license_plate,
                        process_status,
                        cleaning_type,
                    }
                }
                return res.status(200).send(response);
            });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server Error')
    }
}

export const deleteCustomerCreated = async (req, res) => {
    const { id } = req.params;
    const token = req.headers.authorization;
    const decodedToken = decodeToken(token);
    const codCompany = decodedToken.codCompany;

    const sql = `DELETE FROM car_registration WHERE id = ? and cod_company=?`;
    try {
        db.run(sql, id, codCompany, function (err) {
            if (err) {
                console.error(err.message);
                return res.status(500).send({
                    success: false,
                    error: true,
                    message: 'erro ao realizar a consulta'
                });
            }

            if (this.changes === 0) {
                return res.status(404).send({
                    success: false,
                    error: true,
                    message: `ocorreu um erro, ID: ${id} não encontrado`
                });
            }

            return res.sendStatus(204);
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server Error');
    }
}
