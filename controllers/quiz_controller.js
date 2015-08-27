/* Load models*/
var models = require('../models/models');

/* MW Autoload DB object if requested route includes :quizId */
exports.load = function(req, res, next, quizId){
  models.Quiz.find({
    where: {id: Number(quizId)},
    include: [{model: models.Comment}]
  })
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

/* MW ownershipRequired */
exports.ownershipRequired = function(req, res, next){
  var objQuizOwner = req.quiz.UserId;
  var logUser = req.session.user.id;
  var isAdmin = req.session.user.isAdmin;
  if(isAdmin || objQuizOwner === logUser){
    next();
  }else{
    res.redirect('/');
  }
};

/* GET /quizes/new */
exports.new = function(req, res){
  var quiz = models.Quiz.build({
    question: "Question",
    answer: "Answer",
    theme: ""
   }
  );
  res.render('quizes/new', {quiz: quiz, errors: []});
};

/* GET /quizes && GET /user/:userId/quizes */
exports.index = function(req, res, next){
  //var findOptions = {where: {}, order: [["question", "ASC"]]};
  var findOptions = {where: {}, order: 'LOWER(question) ASC'};
  var myQuestions = {};

  if(req.user){//MyQuestions page
    myQuestions = true;
    findOptions.where.UserId = req.user.id;
  }else{//Questions page
    myQuestions = false;
  }

  if(req.query.search){
    var lookfor = req.query.search;
    lookfor = "%" + lookfor.replace(/(\s)+/g,'%') + "%";
    //findOptions.where = ["LOWER(question) like ?", lookfor.toLowerCase()];
    //findOptions.where = {question: {$like:lookfor}};
    findOptions.where.question = {$like:lookfor};
    //findOptions.where = ["LOWER(question) like ? AND UserId IS 3", lookfor.toLowerCase()];
    //findOptions.where ={question: {$like:lookfor}, UserId: req.user.id };
  }

  if(req.query.theme && req.query.theme !== "all"){
    findOptions.where.theme = req.query.theme;
  }

  models.Quiz.findAll(findOptions)
  .then(function(quizes){
    res.render('quizes/index',{quizes: quizes, myquestions: myQuestions, errors: []});
  })
  .catch(function(error){
    next(error);
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
  req.body.quiz.UserId = req.session.user.id;
  if(req.files.image){
    req.body.quiz.image = req.files.image.name;
  }
  var quiz = models.Quiz.build(req.body.quiz);
  quiz.validate().then(function(error){
    if(error){//No HTML 5 browser
      quiz = {question: "Question", answer: "Answer"};
      res.render('quizes/new', {quiz: quiz, errors: error.errors});
    }else{
      quiz.save({fields: ['question', 'answer', 'theme', 'UserId', 'image']})
      .then(function(){
        res.redirect('/quizes');
      });
    }
  });
};

/* PUT /quizes/:id [method-override] */
exports.update = function(req, res){
  var backupQuiz = {question: req.quiz.question, answer: req.quiz.answer,
  theme: req.quiz.theme};
  req.quiz.question = req.body.quiz.question;
  req.quiz.answer = req.body.quiz.answer;
  req.quiz.theme = req.body.quiz.theme;

  if(req.files.image){
    backupQuiz.image = req.quiz.image;
    req.quiz.image = req.files.image.name;
  }

  req.quiz.validate().then(function(error){
    if(error){//No HTML5 browser
      req.quiz.question = backupQuiz.question;
      req.quiz.answer = backupQuiz.answer;
      if(backupQuiz.image){
        req.quiz.image = backupQuiz.image;
      }
      res.render('quizes/edit', {quiz: req.quiz, errors: error.errors});
    }else{
      req.quiz.save({
        fields: ["question", "answer", "theme", "image"]
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
