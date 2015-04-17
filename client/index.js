/* global Firebase: true */
'use strict';

var root, characters;

$(document).ready(init);

function init(){
  root = new Firebase('https://mj-firebasegame.firebaseio.com/');
  characters = root.child('characters');
  $('#create-user').click(createUser);
  $('#login-user').click(loginUser);
  $('#logout-user').click(logoutUser);
  characters.on('child_added', characterAdded);
  $('#create-character').click(createCharacter);
}

function characterAdded(snapshot){
  var character = snapshot.val();
  var myUid = root.getAuth() ? root.getAuth().uid : '';
  var active = '';

  if(myUid === character.uid){
    active = 'active';
  }


  var tr = '<tr class="'+active+'"><td>'+character.handle+'</td><td><img class="avatarPic" src="'+character.avatar+'"></img></td></tr>';
  $('#characters > tbody').append(tr);
}

function createCharacter(){
    var handle = $('#handle').val();
    var avatar = $('#avatar').val();
    var uid = root.getAuth().uid;

    characters.push({
      handle: handle,
      avatar: avatar,
      uid: uid
    });


}

function logoutUser(){
  root.unauth(); // This logs you out
  $('#characters > tbody > tr.active').removeClass('active');

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
      redrawCharacters();
    }
  });
}

function redrawCharacters(){
  $('#characters > tbody').empty();
  characters.off('child_added');
  characters.on('child_added', characterAdded);
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
