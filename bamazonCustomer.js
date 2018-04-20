var mysql = require("mysql");
var inquirer = require("inquirer");
var MYSQLPS = require ('./dbPassword.js');
var request = require ('request');


// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: dbPassword.MYSQLPW,
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  // START FUNCTION
});

function storeCatalog (){

  
}
