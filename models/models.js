var path = require('path');
/* Load ORM model*/
var Sequelize = require('sequelize');

/* DB SQLite */
var sequelize = new Sequelize(
  null, null, null,
  {dialect: "sqlite",
   storage: "quizDB.sqlite"}
);

/* Import Quiz table definition on quiz.js */
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

/* Export Quiz table definition*/
exports.Quiz = Quiz;

/* sequielize.sync() creates and initializes the Quiz table on the DB*/
sequelize.sync().then(function(){
  Quiz.count().then(function(count){
    if(count === 0){
      Quiz.create({
        question: 'What is the best OS?',
        answer: 'linux'
      })
      .then(function(){
        console.log('DB initialized');
      });
    }
  });
});
