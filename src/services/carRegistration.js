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
                res.status(500).send('Error inserting data');
                return
            }
            res.status(200).send('Entry Saved!');
        })

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error')
    }
}

export const readCustomerCreated = async (req, res) => {
    try {
        db.all('SELECT * FROM car_registration', [], (err, rows) => {
            if (err) {
                throw err;
            }
            res.send(rows);
        });
    } catch (error) {
        console.error(error);
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
                    console.log(err);
                    return res.status(500).send(err.message);
                }

                if (this.changes === 0) {
                    return res.status(404).send(`Customer with id ${id} not found`);
                }

                res.send(`Registro com id ${id} atualizado com sucesso!`);
            });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error')
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
                return res.status(404).send(`Customer with id ${id} not found`);
            }

            res.status(200).send(`Customer with id ${id} deleted`);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro interno do servidor');
    }
}
