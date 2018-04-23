var mysql = require('mysql');
var inquirer = require('inquirer');
var app = require('./functions');
var MYSQLPS = require('./dbPassword.js');
var request = require('request');
var orderGrandTotal = 0;

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '4390',
  database: 'bamazon',
});

// start application
connection.connect(function (err) {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId + '\n');
  start();
});

// start function
function start() {
  inquirer
    .prompt({
      type: 'rawlist',
      message: 'Enter Login Info or Create new user, press 1, 2 or 3',
      choices: ['Login', 'New User', 'Exit'],
      name: 'bamazonAccess',
    })
    .then(function (res) {
      // based on their answer, either call the bid or the post functions

      //if (err){ throw err}
      console.log(res);

      var choice = res.bamazonAccess;

      switch (choice) {
        case 'Login':
          login();
          break;

        case 'New User':
          //console.log('create user function working');
          newUser();
          break;
          return;

        case 'Exit':
          return 'Good bye! Thank you for visiting Bamazon';
          break;

        default:
          console.log('Invalid Choice, going back to the main menu');
          start();
      }
    });
}

function login() {
  inquirer
    .prompt([{
        type: 'input',
        name: 'username',
        message: 'Please enter your username/email:',
      },
      {
        name: 'password',
        type: 'input',
        message: 'Please enter your password:',
      },
    ])
    .then(function (res) {
      //console.log (res);

      var query = 'SELECT * FROM user WHERE ?';

      connection.query(query, {
        username: res.username
      }, function (
        err,
        response
      ) {
        //console.log (response[0].user_type);
        //console.log (response[0].passw);
        if (err) throw err;

        if (res.password == response[0].passw) {
          console.log(
            '\n WELCOME TO BAMAZON, you are logged in as:' +
            response[0].username +
            '\n'
          );

          switch (response[0].user_type) {
            case 'USER':
              showStore();
              break;
            case 'MGR':
              mgrMenu();
              break;
            default:
              return;
          }
        } else {
          console.log('\n Incorrect Credentials, please try again \n');
          login();
        }
      });
    });
}

function showStore() {
  console.log(
    '============================================================\n' +
    '====================WELCOME==TO=BAMAZON=====================\n' +
    '============================================================\n'
  );

  var query = 'SELECT * FROM products';

  connection.query(query, function (err, store) {
    if (err) throw err;
    console.log('ID | PRODUCT NAME | PRICE');
    for (var i = 0; i < store.length; i++) {
      console.log(
        store[i].item_id +
        ' | ' +
        store[i].product_name +
        ' | ' +
        store[i].price
      );
    }
    console.log('============================================================');
    shopNow();
  });
}

function shopNow() {
  inquirer
    .prompt([{
        type: 'input',
        name: 'id',
        message: 'Please enter the product ID for the item you want to purchase:',
      },
      {
        name: 'quantity',
        type: 'input',
        message: 'Please Enter the Quantity:',
      },
      {
        name: 'moreItems',
        type: 'confirm',
        message: 'Would you like to buy and additional Item?',
      },
    ])
    .then(function (res) {
      var item = res.id;
      var qty = res.quantity;
      var option = res.moreItems;
      var query = 'SELECT * FROM products WHERE ?';

      connection.query(query, {
        item_id: item
      }, function (err, order) {
        if (err) throw err;

        if (qty > order[0].stock_quantity) {
          console.log(
            'We are sorry, the quantity you have ordered for ' +
            order[0].product_name +
            'is not available, there is only ' +
            order[0].stock_quantity +
            ' items available; you will be return to the store Menu'
          );
          console.log(
            '============================================================'
          );
          showStore();
        } else {
          var orderTotal = order[0].price * parseInt(qty);
          var newInv = order[0].stock_quantity - qty;
          orderGrandTotal = orderGrandTotal + orderTotal;

          console.log(
            'You have place and order for:\n' +
            qty +
            '    ' +
            order[0].product_name +
            '\n'
          );
          console.log(
            'Your total for this purchase is: $' +
            orderTotal +
            '\n' +
            'Your order grand total on this session is: $' +
            orderGrandTotal +
            '\n'
          );

          switch (option) {
            case true:
              showStore();
              updateInv(item, newInv);
              break;

            case false:
              console.log(
                'Thank you for purchasing with Bamazon, the application will now close'
              );
              updateInv(item, newInv);
              return;
          }
        }
      });
    });
}

function mgrMenu() {
  inquirer
    .prompt({
      type: 'rawlist',
      message: 'Please select from the following options: ',
      choices: [
        'Add Product',
        'Check Store Stock Status',
        'Check Low Inventory',
        'Update Product Inventory',
        'Create New User',
        'Update Existing User Type (User to MGR or MGR to USER)',
        'Shop',
        'Go back to Main Menu',
      ],
      name: 'bamazonMGR',
    })
    .then(function (res) {
      // based on their answer, either call the bid or the post functions

      //if (err){ throw err}
      console.log(res);

      var choice = res.bamazonMGR;

      switch (choice) {
        case 'Add Product':
          addNewProduct();
          break;

        case 'Check Store Stock Status':
          productInv();
          break;

        case 'Update Existing User Type (User to MGR or MGR to USER)':
          //updateUser();
          break;

        case 'Check Low Inventory':
          lowInv();
          break;

        case 'Update Product Inventory':
          updateInventoryMGR();
          break;

        case 'Create New User':
          newUserMGR();
          break;

        case 'Go back to Main Menu':
          start();
          break;

        case 'Shop':
          showStore();
          break;

        default:
          console.log('Invalid Choice, going back to the main menu');
          start();
      }
    });
}

function updateInv(item, newInv) {
  var item = item;
  var inv = newInv;

  //console.log('Inv function called');
  var query = connection.query(
    'UPDATE products SET ? WHERE ?', [{
        stock_quantity: newInv,
      },
      {
        item_id: item,
      },
    ],
    function (err, res) {
      // console.log(res.affectedRows + ' products updated!\n');
    }
  );
}

function newUser() {
  console.log(
    'Welcome to BAMAZON, a menu will be prompt to create your new account!\n'
  );

  inquirer
    .prompt([{
        type: 'input',
        name: 'username',
        message: 'Please enter an email/username to create your account :',
      },
      {
        type: 'input',
        name: 'password',
        message: 'Please create a password (alphanumeric)',
      },
    ])
    .then(function (nUser) {
      var query = 'INSERT INTO user SET ?';

      connection.query(
        query, {
          username: nUser.username,
          passw: nUser.password,
          user_type: 'USER',
        },
        function (err, res) {
          console.log(
            res.affectedRows +
            ' new user has been created \n' +
            'You will be return to the main menu, then you can go ahead an login \n'
          );
          start();
        }
      );
    });
}

function productInv() {
  console.log(
    '============================================================\n' +
    '====================WELCOME==TO=BAMAZON=====================\n' +
    '============================================================\n'
  );

  var query = 'SELECT * FROM products';

  connection.query(query, function (err, store) {
    if (err) throw err;
    console.log('ID | PRODUCT NAME | PRICE | COST | INVENTORY');
    for (var i = 0; i < store.length; i++) {
      console.log(
        store[i].item_id +
        ' | ' +
        store[i].product_name +
        ' | ' +
        store[i].price +
        ' | ' +
        store[i].cost +
        ' | ' +
        store[i].stock_quantity
      );
    }
    console.log('============================================================');

    mgrMenu();
  });
}

function lowInv() {
  console.log(
    '============================================================\n' +
    '====================WELCOME==TO=BAMAZON=====================\n' +
    '=======================LOW INV LISTING======================\n'
  );

  var query = 'SELECT * FROM products WHERE stock_quantity <= 10';

  connection.query(query, function (err, store) {
    if (err) throw err;
    console.log('ID | PRODUCT NAME | PRICE | COST | INVENTORY');
    for (var i = 0; i < store.length; i++) {
      console.log(
        store[i].item_id +
        ' | ' +
        store[i].product_name +
        ' | ' +
        store[i].price +
        ' | ' +
        store[i].cost +
        ' | ' +
        store[i].stock_quantity
      );
    }
    console.log('============================================================');

    mgrMenu();
  });
}

function addNewProduct() {
  inquirer
    .prompt([{
        type: 'input',
        name: 'productname',
        message: 'Please enter new Product Name/Description:',
      },
      {
        name: 'quantity',
        type: 'input',
        message: 'Please Enter Initial Inventory Quantity',
      },
      {
        name: 'cost',
        type: 'input',
        message: 'Please Enter the Cost per Item',
      },
      {
        name: 'price',
        type: 'input',
        message: 'Please Enter the Price per Item',
      },
      {
        name: 'category',
        type: 'rawlist',
        message: 'Please Select the Category',
        choices: [
          'Books',
          'Kitchen & Dinning',
          'Electronics',
          'Baby',
          'Beauty & Health',
          'Home Improvement',
          'Women',
          'Men',
          'Grocery',
        ],
      },
    ])
    .then(function (res) {
      connection.query(
        'INSERT INTO products SET ?', {
          product_name: res.productname,
          department_name: res.category,
          stock_quantity: res.quantity,
          cost: res.cost,
          price: res.price,
        },
        function (err, res) {
          if (err) throw err;

          //console.log(res.affectedRows + ' product inserted!\n');
        }
      );

      mgrMenu();
    });
}

function updateInventoryMGR() {

  console.log("\n\r ");
  
  inquirer
    .prompt([{
        type: 'input',
        name: 'id',
        message: 'Select Item Id to be updated: ',
      },
      {
        type: 'input',
        name: 'newInv',
        message: 'Enter New Quantity Available: ',
      },
    
    ])
    .then(function (res) {
      //console.log('Inv Update function called');

    connection.query(
        'UPDATE products SET ? WHERE ?', [{
            stock_quantity: res.newInv,
          },
          {
            item_id: res.id,
          },
        ],
        function (err, res) {
          console.log(res.affectedRows + ' products updated!\n');
        }
      );
      
    });

    mgrMenu();
}


function newUserMGR() {
  console.log(
    'Hello, a menu will be prompt to create the new user account!\n'
  );

  inquirer
    .prompt([{
        type: 'input',
        name: 'username',
        message: 'Please enter an email/username to create the account :',
      },
      {
        type: 'input',
        name: 'password',
        message: 'Please create a password (alphanumeric)',
      },
      {
        type: 'rawlist',
        name: 'type',
        message: 'Please select profile Type (USER OR MGR)',
        choices: ['USER', 'MGR'],
      },
    ])
    .then(function (nUser) {
      var query = 'INSERT INTO user SET ?';

      connection.query(
        query, {
          username: nUser.username,
          passw: nUser.password,
          user_type: nUser.type,
        },
        function (err, res) {
          console.log(
            res.affectedRows +
            ' new user has been created \n' +
            'You will be returned to the Manager Manue.\n'
          );
          mgrMenu();
        }
      );
    });
}