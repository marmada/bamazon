var mysql = require("mysql");
var inquirer = require("inquirer");

var MYSQLPS = require ('./dbPassword.js');
var request = require ('request');


// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: MYSQLPS,
  database: "products"
});
