import { v4 as uuidv4 } from 'uuid';
import { db } from '../dbConnect.js'

export const createEntryCustomer = async (req, res) => {
    try {
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
        const created_at = new Date().toISOString();


        const sql = `INSERT INTO car_registration (id, customer_name, car_brand, car_model, car_year, car_license_plate, process_status, cleaning_type, created_at) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [id, customer_name, car_brand, car_model, car_year, car_license_plate, process_status, cleaning_type, created_at];

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
        db.all('SELECT * FROM car_registration ORDER BY created_at desc', [], (err, rows) => {
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
        const { customer_name, car_brand, car_model, car_year, car_license_plate, process_status, cleaning_type } = req.body;
        const updated_at = new Date().toISOString();

        db.run('UPDATE car_registration SET customer_name=?, car_brand=?, car_model=?, car_year=?, car_license_plate=?, process_status=?, cleaning_type=?, updated_at=? WHERE id=?',
            [customer_name, car_brand, car_model, car_year, car_license_plate, process_status, cleaning_type, updated_at, id], function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).send({
                        message: 'Erro ao atualizar os dados, formato inválido ou vazio',
                        data: {
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

                res.status(200).send(`Cliente atualizado com sucesso`);
            });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error')
    }
}

export const deleteCustomerCreated = async (req, res) => {
    try {
        const { id } = req.params;
        db.run(`DELETE FROM car_registration WHERE id = ?`, id, function (err) {
            if (err) {
                console.log(err.message);
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
