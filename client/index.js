/* global Firebase: true */
'use strict';

var root, characters, myKey, myCharacter;

$(document).ready(init);

function init(){
  root = new Firebase('https://mj-firebasegame.firebaseio.com/');
  characters = root.child('characters');
  $('#create-user').click(createUser);
  $('#login-user').click(loginUser);
  $('#logout-user').click(logoutUser);
  characters.on('child_added', characterAdded);
  characters.on('child_changed', characterChanged);
  $('#create-character').click(createCharacter);
  $('#start-user').click(startUser);
  $(document).keydown(keyDown);
}

function keyDown(event){
  // $('#board').find('img[src="'+myCharacter.avatar+'"]');
  var x = $('#board').find('img[src="'+myCharacter.avatar+'"]').parent().data('x')
  var y = $('#board').find('img[src="'+myCharacter.avatar+'"]').parent().data('y')
  switch(event.keyCode){
    case 37:
      x -= 1;
      break;
    case 38:
      y -= 1;
      break;
    case 39:
      x += 1;
      break;
    case 40:
      y += 1;
      break;
  }
  characters.child(myKey).update({x:x, y:y});
  event.preventDefault();
}

function characterAdded(snapshot){
  var character = snapshot.val();
  var myUid = root.getAuth() ? root.getAuth().uid : '';
  var active = '';

  if(myUid === character.uid){
    myKey = snapshot.key();
    myCharacter = character;
    active = 'active';
  }

  var tr = '<tr class="'+active+'"><td>'+character.handle+'</td><td><img class="avatarPic" src="'+character.avatar+'"></img></td></tr>';
  $('#characters > tbody').append(tr);
}

function characterChanged(snapshot){
  var character = snapshot.val();
  var x = character.x;
  var y = character.y;
  // Find the old picture and remove it
  $('#board').find('img[src="'+character.avatar+'"]').parent().empty();
  //place it in a random spot
  $('#board > tbody > tr > td[data-x='+x+'][data-y='+y+']').empty();
  $('#board > tbody > tr > td[data-x='+x+'][data-y='+y+']').append('<img class="avatarPic" src='+character.avatar+'></img>');
  console.log(character);

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
  myKey = null;
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

function startUser(){
  var x = Math.floor(Math.random() * 10);
  var y = Math.floor(Math.random() * 10);
  characters.child(myKey).update({x:x, y:y});
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
