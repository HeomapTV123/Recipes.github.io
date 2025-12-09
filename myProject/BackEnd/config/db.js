const mysql = require("mysql2");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "@Heo0938757774",
    database: "recipetine"
});

module.exports = db;
