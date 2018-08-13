var db = require('./db.js');
var mysql = require('mysql');
var inqurer = require('inquirer');

var connection = mysql.createConnection({
    host: db.host,
    port: db.port,
    user: db.user,
    password: db.password,
    database: db.database
});

inqurer.prompt([{
    name: 'selection',
    type: 'list',
    message: 'What to do:'
}])
