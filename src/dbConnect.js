import { DB_HOST } from "./config.js";
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database(DB_HOST);

export { db };
