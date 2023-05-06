import { PORT } from './config.js';
import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { db } from './dbConnect.js'

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API Available at ' + new Date());
});

app.post('/new-entry', async (req, res) => {
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
});

app.get('/list-entries', async (req, res) => {
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
})

app.put('/update-entry/:id', async (req, res) => {
    try {
        const db = new sqlite3.Database('car_wash.db');
        const { id } = req.params;
        const { customer_name, car_brand, car_model, car_year, car_license_plate, process_status, cleaning_type } = req.body;

        db.run('UPDATE car_registration SET customer_name=?, car_brand=?, car_model=?, car_year=?, car_license_plate=?, process_status=?, cleaning_type=? WHERE id=?',
            [customer_name, car_brand, car_model, car_year, car_license_plate, process_status, cleaning_type, id], function (err) {
                if (err) {
                    console.log(err);
                    return res.status(500).send(err.message);
                }
                res.send(`Registro com id ${id} atualizado com sucesso!`);
            });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error')
    }
});

app.delete('/delete-entry/:id', async (req, res) => {
    try {
        const { id } = req.params;
        db.run(`DELETE FROM car_registration WHERE id = ?`, id, (err) => {
            if (err) {
                console.log(err.message);
                return res.status(500).send('Internal Server Error');
            }
            res.status(200).send(`Car with id ${id} deleted`);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro interno do servidor');
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} !`);
});
