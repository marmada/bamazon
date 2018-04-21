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
        message: 'Please enter your username/email:',
      },
      {
        name: 'password',
        type: 'input',
        message: 'Please enter your password:',
      },
    ])
    .then (function (res) {

      //console.log (res);

      var id = res.username;
      var psw = res.password;
      var query = 'SELECT * FROM user WHERE ?';

      connection.query (query, {username: res.username}, function (
        err,
        response
      ) {
        //console.log (response[0].user_type);
        //console.log (response[0].passw);
        if (err) throw err;

        if (psw == response[0].passw) {
        console.log ('WELCOME TO BAMAZON, you are login as:' + response[0].username);

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

function showStore () {
  console.log (
    '============================================================\n' +
      '====================WELCOME==TO=BAMAZON=====================\n' +
      '============================================================\n'
  );

  var query = 'SELECT * FROM products';

  connection.query (query, function (err, store) {
    if (err) throw err;
    console.log ('ID | PRODUCT NAME | PRICE');
    for (var i = 0; i < store.length; i++) {
      console.log (
        store[i].item_id +
          ' | ' +
          store[i].product_name +
          ' | ' +
          store[i].price
      );
    shopNow();
    }});}

    function shopNow(){
      inquirer
    .prompt ([
      {
        type: 'input',
        name: 'id',
        message: 'Please enter the product ID for the item you want to purchase:',
      },
      {
        name: 'quantity',
        type: 'input',
        message: 'Please Enter the Quantity',
      },
      { name: 'moreItems',
        type: 'confirm',
        message: "Would you like to buy and additional Item?"}
    ])
    .then (function (res) {
      var item = res.id;
      var qty = parseINT(res.quantity);
      var option = res.moreItems;
      var query = 'SELECT * FROM products WHERE ?';

      connection.query (query, {item_id : item}, function (err, order) {
      if (err) throw err;

      if( qty > order[0].stock_quantity){
        
        console.log("We are sorry, the quantity you have ordered for" + order[0].product_name + "is not available, you will be return to the store Menu");
        showStore();
      }
      else{

        var orderTotal = order[0].price * qty;
        var newInv = order[0].stock_quantity - qty;
        console.log("You have place and order for:" + qty + " " + order[0].product_name);
        console.log("Your order total is: $"+ orderTotal);
      }
      
      switch (option){
      
        case true :
        showStore();
        updateInv(item, newInv);
        break;

        case false :
        console.log("Thank you for purchasing with Bamazon, application will close now");
        return
    }

    });});}


function mgrMenu () {
  var query = 'SELECT * FROM products';

  connection.query (query, function (err, store) {
    console.log ('mgrfunction works');
  });
}

function updateInv (item, newInv){

  var item = item;
  var inv = newInv;
  


}