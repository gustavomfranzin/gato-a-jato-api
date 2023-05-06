import { PORT } from './config.js';
import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';


const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API Available at ' + new Date());
});

const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.post('/new-entry', async (req, res) => {
    try {
        const entriesPath = path.join(__dirname, 'entries.json');
        const entriesContent = await fs.readFile(entriesPath, 'utf-8');

        let entriesArray = JSON.parse(entriesContent);

        const now = new Date();
        const newEntry = { id: uuidv4(), ...req.body, created_at: now.toISOString() };
        entriesArray.push(newEntry);

        await fs.writeFile(entriesPath, JSON.stringify(entriesArray));

        res.status(200).send('Entry Saved!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error')
    }
});

app.get('/list-entries', async (req, res) => {
    try {
        const entriesPath = path.join(__dirname, 'entries.json');
        const entriesContent = await fs.readFile(entriesPath, 'utf-8');

        const entriesArray = JSON.parse(entriesContent);
        res.status(200).json(entriesArray);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error')
    }
})

app.put('/update-entry/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;

        const entriesPath = path.join(__dirname, 'entries.json');

        const entriesContent = await fs.readFile(entriesPath, 'utf8');
        let entries = JSON.parse(entriesContent);

        const entryToUpdateIndex = entries.findIndex(entry => entry.id === id);

        if (entryToUpdateIndex === -1) {
            res.status(404).send('Customer not found');
            return;
        }

        entries[entryToUpdateIndex] = {
            ...entries[entryToUpdateIndex],
            ...updates,
        };

        await fs.writeFile(entriesPath, JSON.stringify(entries), 'utf8');

        res.send('Customer updated');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error')
    }
});

app.delete('/delete-entry/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const entriesPath = path.join(__dirname, 'entries.json');
        const entriesContent = await fs.readFile(entriesPath, 'utf-8');
        const entriesArray = JSON.parse(entriesContent);

        const entryIndex = entriesArray.findIndex(entry => entry.id === id);



        if (entryIndex === -1) {
            res.status(404).send('Customer not found');
            return;
        }

        entriesArray.splice(entryIndex, 1);

        await fs.writeFile(entriesPath, JSON.stringify(entriesArray));

        res.status(200).send('Entry removed');


    } catch (error) {
        console.error(error);
        res.status(500).send('Erro interno do servidor');
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
