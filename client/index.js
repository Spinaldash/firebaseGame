/* global Firebase: true */
'use strict';

var root, users, me;

$(document).ready(init);

function init(){
  root = new Firebase('https://mj-firebasegame.firebaseio.com/');
  users = root.child('users');
  $('#create-user').click(createUser);
  $('#login-user').click(loginUser);
  users.on('child_added', userAdded);
}

function userAdded(snapshot){
}

function loginUser(){
  var email = $('#email').val();
  var password = $('#password').val();

  root.authWithPassword({
    email    : email,
    password : password
  }, function(error, authData) {
    if (error) {
      console.log("Login failed!", error);
    } else {
      console.log("Authenticated successfully with payload:", authData);
    }
  });
}


function createUser(){
  console.log('running createUser');
  var email = $('#email').val();
  var password = $('#password').val();

  root.createUser({
    email    : email,
    password : password
  }, function(error, userData) {
    if (error) {
      console.log("Error creating user:", error);
    } else {
      console.log("Successfully created user account with uid:", userData.uid);
    }
  });
}
