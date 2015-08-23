/* Load models*/
var models = require('../models/models');

/*GET /quizes/question*/
exports.question = function(req, res){
  models.Quiz.findAll().then(function(found){
    res.render('quizes/question',{question: found[0].question});
  });
};

/*GET /quizes/answer*/
exports.answer = function(req, res){
  models.Quiz.findAll().then(function(found){
    if(req.query.answer.toLowerCase() === found[0].answer ){
      res.render('quizes/answer',{
        answer: 'Correct!',
        yourAnswer: req.query.answer
      });
    }else{
      res.render('quizes/answer',{
        answer: "You're wrong",
        yourAnswer: req.query.answer
      });
    }
  });
};
