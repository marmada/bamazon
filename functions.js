var mysql = require("mysql");
var inquirer = require("inquirer");
var request = require ('request');

function login(){

    inquirer
    .prompt({
          
    name: username,
    type: "text",
    message: "Please enter your username"
    },
    {
      name: password,
      type: "password",
      message: "Please enter your password",
     
    }
  
  .then(function(res) {
    // based on their answer, either call the bid or the post functions
    if (err) throw err;
  
    var user = res.username;
    var psw =res.password;
    validateUser(user, psw);
  }));
  }



function createUser(){

}

  


