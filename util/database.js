const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'academind__nodejs',
    password: 'Lakindu@123'
});

module.exports = pool.promise();