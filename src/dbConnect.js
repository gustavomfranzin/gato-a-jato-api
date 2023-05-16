import { DB_TOKENS, DB_ACCOUNTS, DB_HOST } from "./config.js";
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database(DB_HOST);

const db_accounts = new sqlite3.Database(DB_ACCOUNTS)

const db_tokens = new sqlite3.Database(DB_TOKENS)

export { db, db_accounts, db_tokens };
