require('dotenv').config();
const pool = require('./database');

async function testConnection() {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Database connected successfully:', res.rows[0]);
        const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log('Tables:', tables.rows);
    } catch (err) {
        console.error('Database connection error:', err.message);
    } finally {
        pool.end();
    }
}

testConnection();
