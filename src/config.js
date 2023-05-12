import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || '';

export const DB_HOST = process.env.DB_HOST || '';

export const DB_ACCOUNTS = process.env.DB_ACCOUNTS || '';

export const TOKEN_ACCOUNTS = process.env.TOKEN_ACCOUNTS || '';

export const TOKEN_REFRESH_ACCOUNTS = process.env.TOKEN_REFRESH_ACCOUNTS || '';

export const EXPIRATION_TOKEN_ACCOUNTS = process.env.EXPIRATION_TOKEN_ACCOUNTS || '15m'

export const EXPIRATION_TOKEN_REFRESH_ACCOUNTS = process.env.EXPIRATION_TOKEN_REFRESH_ACCOUNTS || '1d'
