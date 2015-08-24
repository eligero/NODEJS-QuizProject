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

/* GET /quizes/new */
exports.new = function(req, res){
  var quiz = models.Quiz.build(
    {question: "Question",
     answer: "Answer"}
  );
  res.render('quizes/new', {quiz: quiz});
};

/* POST /quizes/create */
exports.create = function(req,res){
  var quiz = models.Quiz.build(req.body.quiz);
  console.log("QUIZ: "+req.body.quiz);
  quiz.save({fields: ['question', 'answer']})
  .then(function(){
    res.redirect('/quizes');
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
  var check = {msg: "You're wrong!",
               buttonRedir: req.quiz.id,
               buttonValue: "Try again!",
               yourAnswer: req.query.answer};

  if(req.query.answer.toLowerCase() === req.quiz.answer){
    check.msg = "Correct!";
    check.buttonRedir = "";
    check.buttonValue = "More questions!";
  }
  res.render('quizes/answer',{
    quiz: req.quiz,
    check: check
  });
};
