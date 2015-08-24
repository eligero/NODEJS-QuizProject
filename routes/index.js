var express = require('express');
var router = express.Router();

/* quizController in order to use methods inside quiz_controller.js*/
var quizController = require('../controllers/quiz_controller');

/* commnetController in order to use methods inside comment_controller.js*/
var commentController = require('../controllers/comment_controller');

/* Autoload DB quiz object*/
router.param('quizId', quizController.load);

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {title: 'QUIZ PROJECT', errors:[]});
});

/* GET question routes*/
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new', quizController.new);
router.get('/quizes/:quizId(\\d+)/edit', quizController.edit);
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);

/* POST question routes*/
router.post('/quizes/create', quizController.create);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);

/* PUT question routes*/
router.put('/quizes/:quizId(\\d+)', quizController.update);

/* DELETE question routes*/
router.delete('/quizes/:quizId(\\d+)', quizController.destroy);

module.exports = router;
