var express = require('express');
var router = express.Router();

/* quizController in order to use methods inside quiz_controller.js*/
var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'QUIZ PROJECT' });
});

/* GET question routes*/
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

module.exports = router;
