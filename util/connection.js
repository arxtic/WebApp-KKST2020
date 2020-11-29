var mysql = require('mysql')
require('dotenv').config()

var connection = mysql.createConnection({
    host : process.env.SQL_HOST,
    port : '3306',
    user : process.env.SQL_USER,
    password : process.env.SQL_PASS,
    database : process.env.SQL_DATABASE
})

module.exports = connection
  