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


mainMenu();


function viewProductsForSale() {
 connection.query('SELECT * FROM products', function(err, result) {
     if (err) throw err;
     result.forEach(element => {
         console.log('Product name: ' + element.product_name);
         console.log('Departnemt name: ' + element.department_name);
         console.log('Price: $' + element.price);
         console.log('Quantity: ' + element.stock_quantity);
         console.log('--------------------');
     });
 });
    connection.end();
};

function viewLowInventory() {
    connection.query('SELECT * FROM products WHERE stock_quantity < 10', function(err, result) {
        if (err) throw err;
        result.forEach(element => {
            console.log('Less than 10 in stock:');
            console.log('Product name: ' + element.product_name);
            console.log('Departnemt name: ' + element.department_name);
            console.log('Price: $' + element.price);
            console.log('Quantity: ' + element.stock_quantity);
            console.log('--------------------');
        });
    });
   connection.end();
};

function addToInventory() {

    connection.query('SELECT * FROM products', function(err, result) {
        if (err) throw err;
        var products = [];
        result.forEach(element => {
            var product = {
                name: element.product_name,
                value: {
                    product_name: element.product_name,
                    department_name: element.department_name,
                    price: element.price,
                    stock_quantity: element.stock_quantity,
                    item_id: element.item_id
                }
            };
            products.push(product);
        });

        inqurer.prompt([{
            name: 'item',
            type: 'list',
            message: 'Which would you like to increase?',
            choices: products
        },
        {
            name: 'quantity',
            type: 'input',
            message: 'How many?'
        }
        ]).then((selected) => {
            if (selected.quantity <= 0) {
                console.log("Can't be negative or zero.");
                connection.end();
            }
            else {
                var addInventory = "UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?";
                connection.query(addInventory, [selected.quantity, selected.item.item_id], function(err, result) {
                    if (err) throw err;
                    console.log(selected.quantity + ' was added to ' + selected.item.product_name);
                    connection.end();
                });
            }

        });
    });


};

function addNewProduct() {
    inqurer.prompt([{
        name: 'product_name',
        type: 'input',
        message: 'Enter product name:',
    },
    {
        name: 'department_name',
        type: 'input',
        message: 'Enter department name:',
    },
    {
        name: 'price',
        type: 'input',
        message: 'Enter product price:',
    },
    {
        name: 'stock_quantity',
        type: 'input',
        message: 'Enter quantity:',
    }
    ]).then((answers) => {
        var addProduct = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ? ";
        var values = [[answers.product_name,answers.department_name,parseInt(answers.price),parseInt(answers.stock_quantity)]];
        connection.query(addProduct, [values] , function(err, result) {
            if (err) throw err;
        });
       connection.end();
       console.log('Product has been added!');
    });
};

function mainMenu() {

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
        };
    });

};


