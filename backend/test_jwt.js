require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET_AUTH = process.env.JWT_SECRET || 'secret';
const payload = { user: { id: 1 } };
const token = jwt.sign(payload, JWT_SECRET_AUTH, { expiresIn: '1h' });
console.log("Token:", token);

try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    console.log("Decoded:", decoded);
} catch (err) {
    console.error("JWT Error:", err.message);
}
