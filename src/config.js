import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || '';

export const DB_HOST = process.env.DB_HOST || '';

export const DB_ACCOUNTS = process.env.DB_ACCOUNTS || '';

export const TOKEN_ACCOUTNS = process.env.TOKEN_ACCOUTNS || '';

export const TOKE_REFRESH_ACCOUNTS= process.env.TOKE_REFRESH_ACCOUNTS || '';
