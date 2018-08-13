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


function viewProductsForSale() {
 connection.query('SELECT * FROM products', function(err, result) {
     if (err) throw err;
     console.log(result);
 });
connection.end();
};

function viewLowInventory() {

};

function addToInventory() {

};

function addNewProduct() {

};

inqurer.prompt([{
    name: 'selection',
    type: 'list',
    message: 'What to do:',
    choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
}]).then((selected) => {
    switch (selected.selection) {
        case 'View Products for Sale': viewProductsForSale();
        break;
        case 'View Low Inventory': viewLowInventory();
        break;
        case 'Add to Inventory': addToInventory();
        break;
        case 'Add New Product': addNewProduct();
        break;
    }
});
