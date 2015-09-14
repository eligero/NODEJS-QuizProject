/* Load models*/
var models = require('../models/models');
var fs = require('fs');

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
  var selectOption={};
  selectOption["Select"]="selected";
  var quiz = models.Quiz.build({
    question: "",
    answer: "",
    theme: ""
   }
  );
  res.render('quizes/new', {quiz: quiz, varOption: selectOption, newQuestion: true, errors: []});
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
  if(req.query.answer && req.query.answer.length){
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
  var selectOption ={};
  selectOption[[quiz.theme.toString()]]="selected";
  res.render('quizes/edit',{quiz: quiz,varOption: selectOption,newQuestion: false, errors: []});
};

/* POST /quizes/create */
exports.create = function(req,res){
  var selectOption = {};
  var quiz = models.Quiz.build({
    question: (req.body.quiz.question || ""),
    answer: (req.body.quiz.answer || ""),
    theme: req.body.quiz.theme,
    UserId: req.session.user.id
  });
  selectOption[[quiz.theme.toString()]]="selected";

  if(req.files.image){ //Change image
    if(global.imgTMP !== "none"){
      fs.unlink('./public/media/'+global.imgTMP);
    }
    global.imgTMP=req.files.image.name;
    quiz.image=req.files.image.name;
    res.render('quizes/new', {quiz: quiz, varOption: selectOption,
       newQuestion: false, errors: []});
  }else{
    if(req.body.box_rmimg){
      if(global.imgTMP !== "none"){
        fs.unlink('./public/media/'+global.imgTMP);
        global.imgTMP = "none";
      }
    }

    if(global.imgTMP !== "none"){
      quiz.image = global.imgTMP;
    }

    quiz.validate().then(function(error){
      if(error){
        res.render('quizes/new', {quiz: quiz, newQuestion: false, varOption: selectOption, errors: error.errors});
      }else{
        if(global.imgTMP !== "none"){
          global.imgTMP = "none";
        }
        quiz.save({fields: ['question', 'answer', 'theme', 'UserId', 'image']})
        .then(function(){
          res.redirect('/quizes');
        });
      }
    });
  }
};

/* PUT /quizes/:id [method-override] */
exports.update = function(req, res){
  var selectOption = {};
  var quizTMP = models.Quiz.build({
    question: req.body.quiz.question,
    answer: req.body.quiz.answer,
    theme: req.body.quiz.theme
  });
  quizTMP.id = req.quiz.id;
  selectOption[[quizTMP.theme.toString()]]="selected";

  if(req.files.image){ //Change image
    if(global.imgTMP !== "none"){
      fs.unlink('./public/media/'+global.imgTMP);
    }
    global.imgTMP=req.files.image.name;
    quizTMP.image=req.files.image.name;
    res.render('quizes/edit', {quiz: quizTMP, varOption: selectOption,
       newQuestion: false, errors: []});
  }else{ //Save
    if(req.body.box_rmimg){
      if(global.imgTMP !== "none"){
        fs.unlink('./public/media/'+global.imgTMP);
        global.imgTMP = "none";
      }

      if(req.quiz.image){
        fs.unlink('./public/media/'+req.quiz.image);
        quizTMP.image = "none";
      }
    }else{
      if(global.imgTMP !== "none"){
        quizTMP.image = global.imgTMP;
      }
    }
    quizTMP.question = (req.body.quiz.question || "");
    quizTMP.answer = (req.body.quiz.answer || "");
    quizTMP.theme = req.body.quiz.theme;
    quizTMP.validate().then(function(error){
      if(error){
        if(quizTMP.question !== ""){
          req.quiz.question = quizTMP.question;
        }
        if(quizTMP.answer !== ""){
          req.quiz.answer = quizTMP.answer;
        }
        if(quizTMP.theme !== "Select"){
          req.quiz.theme = quizTMP.theme;
        }
        selectOption[[req.quiz.theme.toString()]]="selected";
        res.render('quizes/edit', {quiz: req.quiz, varOption: selectOption,  newQuestion: false, errors: error.errors});
      }else{
        req.quiz.question = quizTMP.question;
        req.quiz.answer = quizTMP.answer;
        req.quiz.theme = quizTMP.theme;
        if(global.imgTMP !== "none"){
          global.imgTMP = "none";
          fs.unlink('./public/media/'+req.quiz.image);
        }
        req.quiz.image = quizTMP.image;
        req.quiz.save({
          fields: ["question", "answer", "theme", "image"]
        }).then(function(){
          res.redirect('/quizes');
        });
      }
    });
  }
};

/* DELETE /quizes/:id [PUT method-override] */
exports.destroy = function(req, res, next){
  if(req.quiz.image !== "none"){
    fs.unlink('./public/media/'+req.quiz.image);
  }
  req.quiz.destroy().then(function(){
    res.redirect('/quizes');
  })
  .catch(function(error){
    next(error);
  })
};
