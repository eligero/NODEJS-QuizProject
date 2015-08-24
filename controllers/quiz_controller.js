/* Load models*/
var models = require('../models/models');

/* Autoload DB object if requested route includes :quizId */
exports.load = function(req, res, next, quizId){
  models.Quiz.findById(quizId)
  .then(function(quiz){
    if(quiz){
      req.quiz = quiz;
      next();
    }else{
      next(new Error('quizId not found: '+quizId));
    }
  }).catch(function(error){
    next(error);
  });
};

/* GET /quizes */
exports.index = function(req, res, next){
  models.Quiz.findAll()
  .then(function(quizes){
    res.render('quizes/index',{quizes: quizes});
  })
  .catch(function(error){
    next(error);
  });
};

/*GET /quizes/:id */
exports.show = function(req, res){
  res.render('quizes/show',{quiz: req.quiz});
};


/* GET /quizes/answer*/
exports.answer = function(req, res){
  var check = "You're wrong!";
  if(req.query.answer.toLowerCase() === req.quiz.answer){
    check = "Correct!";
  }
  res.render('quizes/answer',{
    quiz: req.quiz,
    answer: check,
    yourAnswer: req.query.answer
  });
};
