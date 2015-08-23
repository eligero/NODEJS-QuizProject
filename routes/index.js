var express = require('express');
var router = express.Router();
/* quizController in order to use methods inside quiz_controller.js*/
var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'QUIZ PROJECT' });
});

/* GET a question*/
router.get('/quizes/question', quizController.question);

/* GET check your aunswer*/
router.get('/quizes/answer', quizController.answer);

module.exports = router;
