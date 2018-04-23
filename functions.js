var mysql = require("mysql");
var inquirer = require("inquirer");
var request = require ('request');


function newUser() {
  Console.log(
    'Welcome to BAMAZON, a menu will be prompt to create your new account!\n'
  );

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'username',
        message: 'Please enter an email/username to create your account :',
      },
      {
        type: 'input',
        name: 'password',
        message: 'Please create a password (alphanumeric)'
      },
    ])
    .then(function(nUser) {
      var query = connection.query(
        'INSERT INTO users SET ?',
        {
          username: nUser.username,
          passw: nUser.password,
          user_type: "USER",
        },
        function(err, res) {
          console.log(res.affectedRows + ' new user has been created \n' + 'You will be return to the main menu, then you can go ahead an login \n');
           login();
        }
      );
    });
}


module.exports = {newUser : newUser};