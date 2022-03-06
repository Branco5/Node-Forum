const mysql = require("mysql2");
const options = require("./options.json");

const pool = mysql.createPool(options.mysql);

module.exports = pool.promise();