var mysql = require("mysql");
var inquirer = require("inquirer");
var app = require("./functions");
var MYSQLPS = require ('./dbPassword.js');
var request = require ('request');


// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: 4390,
  database: "bamazon"
});

// start application
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  start();
});

// start function
  function start() {

    inquirer
      .prompt({
        
          type: "list",
          message: "Enter Login Info or Create new user, press 1, 2 or 3",
          choices: ["1) Login" , "2) New User", "3) Exit"],
          name: "amazonAccess"
        }

      .then(function(res) {
        // based on their answer, either call the bid or the post functions
        if (err) throw err;

        var choice = res.amazonAccess;

        switch (choice) {

          case 1: login();
          break;

          case 2: Console.log("create user function working");
          //createUser();
          break;

          case 3:
          return "Good bye! Thank you for visiting Bamazon";
          break;

          default:
          console.log ("Invalid Choice, going back to the main menu");
          start();
          }
      })); 
}

function login(){

  inquirer
  .prompt([{
        
  name: username,
  type: "text",
  message: "Please enter your username"
  },
  {
    name: password,
    type: "password",
    message: "Please enter your password"
   
  }])

.then(function(res) {
  // based on their answer, either call the bid or the post functions
  if (err) throw err;

  var user = res.username;
  var psw =res.password;

  var query = "SELECT user, passw, user_type FROM user WHERE ?";
  connection.query(query, { user: user }, function(err, res) {
    if (err) throw err;
    if (psw== res.passw && user_type=="USER" ){
      console.log("this is working");
     // showStore();
    }
    if(pws== res.passw && user_type=="MGR"){
      console.log("mgr menu working")
      //showMgtMenu();
    }
    else{
      console.log("Incorrect Credentials, please try again");
      login();
    }
  
});
});}
