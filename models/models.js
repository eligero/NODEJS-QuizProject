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
/* Import Comment table definition on comment.js */
var Comment = sequelize.import(path.join(__dirname, 'comment'));
/* Import User table definition on user.js */
var User = sequelize.import(path.join(__dirname, 'user'));


/* Relationship comments and questions */
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

/* Relationship users and questions */
Quiz.belongsTo(User);
User.hasMany(Quiz);

/* Export Quiz table definition*/
exports.Quiz = Quiz;
/* Export Comment table definition*/
exports.Comment = Comment;
/* Export User table definition*/
exports.User = User;

/* sequielize.sync() creates and initializes the tables on the DB*/
sequelize.sync().then(function(){
  User.count().then(function(count){
    if(count === 0){
      User.bulkCreate([
        {username: 'admin', password: 'admin', isAdmin: true},
        {username: 'esteban', password: 'ligero'}
      ])
      .then(function(){
        console.log("User DB table initialized");
        Quiz.count().then(function(count){
          if(count === 0){
            Quiz.bulkCreate([
              {
                question: 'What is the best desktop OS?', answer: 'linux',
                theme: 'Technology', UserId: 2
              },
              {
                question: 'What is the best mobile OS?', answer: 'android',
                theme: 'Technology', UserId: 2
              }
            ])
            .then(function(){
              console.log("Quiz DB table initialized");
            });
          }
        });
      });
    }
  });
});
