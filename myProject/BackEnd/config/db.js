const mysql = require('mysql2');
require("dotenv").config({ path: '.env'});
// MySQL connection

async function connectDB() {
    try {
    const db = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
    
});
    console.log('✅ Connected to MySQL');
    return db;

} catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
}

}

module.exports = connectDB;