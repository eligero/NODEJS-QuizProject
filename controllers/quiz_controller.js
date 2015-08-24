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
  res.render('quizes/new', {quiz: quiz, errors: []});
};

/* GET /quizes */
exports.index = function(req, res){
  models.Quiz.findAll()
  .then(function(quizes){
    res.render('quizes/index',{quizes: quizes, errors: []});
  });
};

/*GET /quizes/:id */
exports.show = function(req, res){
  res.render('quizes/show',{quiz: req.quiz, errors: []});
};


/* GET /quizes/:id/answer */
exports.answer = function(req, res){
  if(req.query.answer.length){
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
      check: check,
      errors: []
    });
  }else{ //No HTML5 browser
    var error = new Array(Object);
    error[0].message="Type an answer!";
    res.render('quizes/show',{quiz: req.quiz, errors: error});
  }
};

/* GET /quizes/:id/edit */
exports.edit = function(req, res){
  var quiz = req.quiz;
  res.render('quizes/edit',{quiz: quiz, errors: []});
};


/* POST /quizes/create */
exports.create = function(req,res){
  var quiz = models.Quiz.build(req.body.quiz);
  quiz.validate().then(function(error){
    if(error){//No HTML 5 browser
      quiz = {question: "Question", answer: "Answer"};
      res.render('quizes/new', {quiz: quiz, errors: error.errors});
    }else{
      quiz.save({fields: ['question', 'answer']})
      .then(function(){
        res.redirect('/quizes');
      });
    }
  });
};

/* PUT /quizes/:id [method-override] */
exports.update = function(req, res){
  var backupQuiz = {question: req.quiz.question, answer: req.quiz.answer};
  req.quiz.question = req.body.quiz.question;
  req.quiz.answer = req.body.quiz.answer;
  req.quiz.validate().then(function(error){
    if(error){//No HTML5 browser
      req.quiz.question = backupQuiz.question;
      req.quiz.answer = backupQuiz.answer;
      res.render('quizes/edit', {quiz: req.quiz, errors: error.errors});
    }else{
      req.quiz.save({
        fields: ["question", "answer"]
      }).then(function(){
        res.redirect('/quizes');
      });
    }
  });
};

/* DELETE /quizes/:id [PUT method-override] */
exports.destroy = function(req, res, next){
  req.quiz.destroy().then(function(){
    res.redirect('/quizes');
  })
  .catch(function(error){
    next(error);
  })
};
