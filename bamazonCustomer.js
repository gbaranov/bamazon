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


connection.query('SELECT * FROM products', function(err, result) {
    if (err) throw err;
    var choices = [];
    result.forEach(element => {
        var item = {
            name: element.product_name + " - $" + element.price,
            value: {
                name: element.product_name,
                price: element.price,
                department: element.department_name,
                quantity: element.stock_quantity,
                id: element.item_id,
            }
        }
        choices.push(item);
    });
    showList(choices);
});

function showList(items) {
    inqurer.prompt([{
        name: 'item',
        type: 'list',
        message: 'What would you like to buy?',
        choices: items
    },
    {
        name: 'quantity',
        type: 'input',
        message: 'How many?'
    }
    ]).then((selected) => {
        if (selected.quantity > selected.item.quantity) {
            console.log('Insufficient quantity! Currently in stock: ' + selected.item.quantity);
            console.log('_________________');
            console.log('Please try again:');
            showList(items);
        }
        else {
            updateStock(selected);
            console.log('Order successfully completed: ');
            console.log(selected.item.name + " - $" + selected.item.price + " x "
                        + selected.quantity
                        );
            console.log("Total amount: $" + selected.quantity * selected.item.price);
        }

      });
};

function updateStock(selected) {
    connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",[selected.quantity, selected.item.id], function(err, result) {
        if (err) throw err;
        connection.end();
    });
};

// function getData() {
//     connection.query('SELECT * FROM products', function(err, result) {
//         if (err) throw err;
//         console.log(result);
//         connection.end();
//     });
// }











