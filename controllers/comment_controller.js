var models = require('../models/models');

/* MW Autoload DB object if requested route includes :commentId */
exports.load = function(req, res, next, commentId){
  models.Comment.find({
    where:{id: Number(commentId)}
  })
  .then(function(comment){
    if(comment){
      req.comment = comment;
      next();
    }else{
      next(new Error('commentId='+commentId+"Doesn't exist"));
    }
  }).catch(function(error){
    next(error);
  });
};

/* MW ownershipRequired */
exports.ownershipRequired = function(req, res, next){
  models.Quiz.find({
    where: {id: Number(req.comment.QuizId)}
  })
  .then(function(quiz){
    if(quiz){
      var objQuizOwner = quiz.UserId;
      var logUser = req.session.user.id;
      var isAdmin = req.session.user.isAdmin;
      if(isAdmin || objQuizOwner === logUser){
        next();
      }else{
        res.redirect('/');
      }
    }else{
      next(new Error('quizId='+quizId+" Doesn't exist"));
    }
  })
  .catch(function(error){
    next(error);
  });

};

/* GET /quizes/:quizId/comments/new */
exports.new = function(req, res){
  res.render('comments/new', {quizid: req.params.quizId, errors: []});
};

//GET /quizes/:quizId/comments/:commentId/publish [autoload necessary]
exports.publish = function(req, res){
  req.comment.published = true;
  req.comment.save({fields: ["published"]}).then(function(){
    res.redirect('/quizes/'+req.params.quizId);
  })
  .catch(function(error){
    next(error);
  });
};

/* POST /quizes/:quizId/comments */
exports.create = function(req, res, next){
  var comment = models.Comment.build({
    text: req.body.comment.text,
    QuizId: req.params.quizId
  });

  comment.validate().then(function(error){
    if(error){//No HTML5 browser
      res.render('comments/new', {comment: comment, quizid: req.params.quizId,
      errors: error.errors});
    }else{
       comment.save().then(function(){
         res.redirect('/quizes/'+req.params.quizId);
       });
    }
  }).catch();
};
