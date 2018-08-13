var db = require('./db.js');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: db.host,
  port: db.port,
  user: db.user,
  password: db.password,
  database: db.database
});
var dropQuery = "DROP TABLE IF EXISTS products;"
var initQuery = "CREATE TABLE ba3sy0t2rhw6do7b.products (item_id INT NOT NULL AUTO_INCREMENT, product_name VARCHAR(45) NOT NULL, department_name VARCHAR(45) NOT NULL, price DECIMAL(6,2) NOT NULL, stock_quantity INT NOT NULL,   PRIMARY KEY (item_id),  UNIQUE INDEX item_id_UNIQUE (item_id ASC));"
var addTestData = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ? ";
var values = [
  ['Apple iPhone 7', 'CellPhones', 699.00, 10],
  ['Apple iPhone 7 Plus', 'CellPhones', 799.00, 15],
  ['Apple iPhone 8', 'CellPhones', 899.00 , 8],
  ['Apple iPhone 8 Plus', 'CellPhones', 999.00, 10],
  ['Samsung Galaxy S8', 'CellPhones', 899.00, 20],
  ['iPhone 8 Case', 'Accessories', 699.00, 10],
  ['iPhone 7 Case', 'Accessories', 699.00, 10],
  ['Apple AirPods', 'Headphones', 149.00, 30],
  ['Beats Solo', 'Headphones', 199.00, 10],
  ['B&W', 'Headphones', 299.00, 10],
];
connection.connect(function(err) {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId + '\n');
  connection.query(dropQuery , function(err, result) {
      if (err) throw err;
      console.log('Table removed.');
  });
  connection.query(initQuery , function(err, result) {
      if (err) throw err;
      console.log('Table created.');
  });
  connection.query(addTestData, [values], function(err, result) {
      if (err) throw err;
      console.log('Data added.');
  });
  connection.query('SELECT * FROM products', function(err, result) {
      if (err) throw err;
      console.log(result);
  });
  connection.end();
});