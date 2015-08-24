var path = require('path');

/* Load ORM model*/
var Sequelize = require('sequelize');

//Postgres DATABASE_URL = postgres://user:passwd@host:port/database
//SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6] || null);
var user = (url[2] || null);
var pwd = (url[3] || null);
var protocol = (url[1] || null);
var dialect = (url[1] || null);
var port = (url[5] || null);
var host = (url[4] || null);
var storage = process.env.DATABASE_STORAGE;

/* DB SQLite or Postgres*/
var sequelize = new Sequelize(
  DB_name, user, pwd, {dialect: protocol,
                       protocol: protocol,
                       port: port,
                       host: host,
                       storage: storage,//SQLite (.env file)
                       omitNull: true //Postgres
                       }
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
        question: 'What is the best desktop OS?',
        answer: 'linux'
      });
      Quiz.create({
        question: 'What is the best mobile OS?',
        answer: 'android'
      })
      .then(function(){
        console.log('DB initialized');
      });
    }
  });
});
