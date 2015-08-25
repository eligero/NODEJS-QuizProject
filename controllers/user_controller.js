var models = require('../models/models');

/* MW Autoload DB object if requested route includes :userId */
exports.load = function(req, res, next, userId){
  models.User.find({
    where: {id: Number(userId)}
  })
  .then(function(user){
    if(user){
      req.user = user;
      next();
    }else{
      next(new Error('userId='+userId+" Doesn't exist!"));
    }
  })
  .catch(function(error){
    next(error);
  });
}

/* Middleware authenticate */
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

/* MW ownershipRequired */
exports.ownershipRequired = function(req, res, next){
  var objUser = req.user.id;
  var logUser = req.session.user.id;
  var isAdmin = req.session.user.isAdmin;
  if(isAdmin || objUser === logUser){
    next();
  }else{
    res.redirect('/');
  }
};

/* GET /user*/
exports.new = function(req, res){
  var user = models.User.build({
    username: "Username",
    password: ""
  });
  res.render('user/new', {user: user, errors: []});
};

/* GET /user/:id/edit */
exports.edit = function(req, res){
  res.render('user/edit', {user: req.user, errors: []});
};

/* POST /user */
exports.create = function(req, res){
  var user = models.User.build(req.body.user);
  user.validate().then(function(error){
    if(error){
      user = models.User.build({
        username: "Username",
        password: ""
      });
      res.render('user/new', {user: user, errors: error.errors});
    }else{
      user.save({
        fields: ["username", "password"]
      })
      .then(function(){
        req.session.user = {id: user.id, username: user.username};
        res.redirect('/');
      });
    }
  })
  .catch(function(error){
    next(error);
  });
};

/* PUT /user/:id */
exports.update = function(req, res, next){
  var backupUser = {username: req.user.username, password: req.user.password}
  req.user.username = req.body.user.username;
  req.user.password = req.body.user.password;
  req.user.validate().then(function(error){
    if(error){
      req.user.username = backupUser.username;
      req.user.password = backupUser.password;
      res.render('user/edit', {user: req.user, errors: error.errors});
    }else{
      req.user.save({
        fields: ["username", "password"]
      })
      .then(function(){
        res.redirect('/');
      });
    }
  })
  .catch(function(error){
    next(error);
  });
};

/* DELETE /user/:id */
exports.destroy = function(req, res){
  req.user.destroy().then(function(){
    delete req.session.user;
    res.redirect('/');
  })
  .catch(function(error){
    next(error);
  });
};
