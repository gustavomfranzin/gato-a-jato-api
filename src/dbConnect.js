import { DB_ACCOUNTS, DB_HOST } from "./config.js";
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database(DB_HOST);

const db_accounts = new sqlite3.Database(DB_ACCOUNTS)

export { db, db_accounts };
