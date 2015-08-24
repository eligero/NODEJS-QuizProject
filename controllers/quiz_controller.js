/* Load models*/
var models = require('../models/models');

exports.index = function(req, res){
  models.Quiz.findAll()
  .then(function(quizes){
    res.render('quizes/index',{quizes: quizes});
  });
};

/*GET /quizes/:id */
exports.show = function(req, res){
  models.Quiz.find({where:{id:[req.params.quizId]}}).then(function(quiz){
    res.render('quizes/show',{quiz: quiz});
  });
};


/*GET /quizes/answer*/
exports.answer = function(req, res){
  models.Quiz.find({where:{id:[req.params.quizId]}}).then(function(quiz){
    if(req.query.answer.toLowerCase() === quiz.answer ){
      res.render('quizes/answer',{
        quiz: quiz,
        answer: 'Correct!',
        yourAnswer: req.query.answer
      });
    }else{
      res.render('quizes/answer',{
        quiz: quiz,
        answer: "You're wrong",
        yourAnswer: req.query.answer
      });
    }
  });
};
