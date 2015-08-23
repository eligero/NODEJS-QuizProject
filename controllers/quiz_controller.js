/*GET /quizes/question*/
exports.question = function(req, res){
  res.render('quizes/question',{question: 'What is the best OS?'});
};

/*GET /quizes/answer*/
exports.answer = function(req, res){
  if(req.query.answer.toLowerCase() === 'linux' ){
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
};
