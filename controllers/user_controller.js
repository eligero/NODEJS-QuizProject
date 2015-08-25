var models = require('../models/models');

exports.authenticate = function(login, password, callback){
  models.User.find({
    where: {username: login}
  })
  .then(function(user){
    if(user){
      if(user.verifyPassword(password)){
        callback(null, user);
      }else{
        callback(new Error('Wrong Password!'));
      }
    }else{
      callback(new Error('User: '+login+" Doesn't exist!"));
    }
  })
  .catch(function(error){
    callback(error);
  });
};
