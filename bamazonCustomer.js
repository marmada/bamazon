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
  password: "4390",
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
        
          type: "rawlist",
          message: "Enter Login Info or Create new user, press 1, 2 or 3",
          choices: [ "Login" , "New User", "Exit"],
          name: "bamazonAccess"
        }

      ).then(function(res) {
        // based on their answer, either call the bid or the post functions
      
        //if (err){ throw err}
        console.log(res);
  

        var choice = res.bamazonAccess;

        switch (choice) {

          case 'Login': 
          login();
          break;
         

          case 'New User': 
          console.log("create user function working");
          //createUser();
          break;
          return;

          case 'Exit':
          return "Good bye! Thank you for visiting Bamazon";
          break;

          default:
          console.log ("Invalid Choice, going back to the main menu");
          start();
          }
      }); 
}

function login(){

  inquirer
  .prompt([{
        
  type: "input",
  name: "username",
  message: "Please enter your username/email"
  },
  {
    name: "password",
    type: "password",
    message: "Please enter your password"
   
  }])

.then(function(res) {

  console.log(res);
  return;

 var user = res.username;
  var psw =res.password;

  var query = "SELECT user, passw, user_type FROM user WHERE ?";
  connection.query(query, { user: user }, function(err, response) {
    if (err) throw err;
    if (psw== response.passw && response.user_type=="USER" ){
      console.log("this is working");
     // showStore();
    }
    if(pws== res.passw && res.user_type=="MGR"){
      console.log("mgr menu working")
      //showMgtMenu();
    }
    else{
      console.log("Incorrect Credentials, please try again");
      login();
    }
  
});
});}
