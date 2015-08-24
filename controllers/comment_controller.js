var models = require('../models/models');

/* GET /quizes/:quizId/comments/new */
exports.new = function(req, res){
  res.render('comments/new', {quizid: req.params.quizId, errors: []});
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
