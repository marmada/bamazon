var mysql = require ('mysql');
var inquirer = require ('inquirer');
var app = require ('./functions');
var MYSQLPS = require ('./dbPassword.js');
var request = require ('request');

// create the connection information for the sql database
var connection = mysql.createConnection ({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '4390',
  database: 'bamazon',
});

// start application
connection.connect (function (err) {
  if (err) throw err;
  console.log ('connected as id ' + connection.threadId + '\n');
  start ();
});

// start function
function start () {
  inquirer
    .prompt ({
      type: 'rawlist',
      message: 'Enter Login Info or Create new user, press 1, 2 or 3',
      choices: ['Login', 'New User', 'Exit'],
      name: 'bamazonAccess',
    })
    .then (function (res) {
      // based on their answer, either call the bid or the post functions

      //if (err){ throw err}
      console.log (res);

      var choice = res.bamazonAccess;

      switch (choice) {
        case 'Login':
          login ();
          break;

        case 'New User':
          console.log ('create user function working');
          //createUser();
          break;
          return;

        case 'Exit':
          return 'Good bye! Thank you for visiting Bamazon';
          break;

        default:
          console.log ('Invalid Choice, going back to the main menu');
          start ();
      }
    });
}

function login () {
  inquirer
    .prompt ([
      {
        type: 'input',
        name: 'username',
        message: 'Please enter your username/email',
      },
      {
        name: 'password',
        type: 'input',
        message: 'Please enter your password',
      },
    ])
    .then (function (res) {
      //console.log (res);

      var id = res.username;
      var psw = res.password;
      var query = 'SELECT * FROM user WHERE ?';

      connection.query (query, {username: id}, function (
        err,
        response
      ) {
        //console.log (response[0].user_type);
        //console.log (response[0].passw);
        if (err) throw err;

        if (psw == response[0].passw) {
          //console.log ('authentification is working');
          switch (response[0].user_type) {
            case 'USER':
              showStore ();
              break;
            case 'MGR':
              mgrMenu ();
              break;
            default:
              return;
          }
        } else {
          console.log ('Incorrect Credentials, please try again');
          login ();
        }
      });
    });
}

function showStore(){

  Console.log("============================================================\n" +
  "=====================WELCOME==TO=BAMAZON======================\n" + 
  "============================================================\n");

  var query = 'SELECT * FROM products';

  connection.query (query, function (
    err,
    store
  ) {
    if (err) throw err;
    console.log ("ID | PRODUCT NAME | PRICE");
    for (var i = 0; i < store.length; i++) {
        console.log(store[i].item_id + " | " + store[i].product_name + " | " + store[i].product_name + "\n");
    } 
  
});}

function mgrMenu(){

  var query = 'SELECT * FROM products';

  connection.query (query, function (
    err,
    store
  ) {
    console.log ("mgrfunction works");
  
});}
