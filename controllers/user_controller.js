var users = {
  admin: {id: 1, username: 'admin', password: 'admin'},
  esteban: {id: 2, username: 'esteban', password:'ligero'}
};

exports.authenticate = function(login, password, callback){
  if(users[login]){
    if(password === users[login].password){
      callback(null, users[login]);
    }else{
      callback(new Error('Wrong Password!'));
    }
  }else{
    callback(new Error("User doesn't exist!"));
  }
};
