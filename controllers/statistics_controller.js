var models = require('../models/models.js');

exports.statistics_process = function(req, res, next) {
  var statistics = {
    nQ:0,//Total number of questions
    nQwC:0,//Total number of questions with comments
    nQwNC:0,//Total number of questions without comments
    nQwACP:0,//Total number of questions with all comments published
    nQwACNP:0,//Total number of questions with all comments not published
    nCPandNP:0,//Total number of comments
    nCP:0,//Total number of published comments
    nCNP:0,//Total number of not published comments
    mCxQ:0,//Average comments per question
    mCxQP:0,//Average published comments per question
    mCxQNP:0//Average not published comments per question
   };

   var MYstatistics = {
     nQ:0,//Total number of questions
     nQwC:0,//Total number of questions with comments
     nQwNC:0,//Total number of questions without comments
     nQwACP:0,//Total number of questions with all comments published
     nQwACNP:0,//Total number of questions with all comments not published
     nCPandNP:0,//Total number of comments
     nCP:0,//Total number of published comments
     nCNP:0,//Total number of not published comments
     mCxQ:0,//Average comments per question
     mCxQP:0,//Average published comments per question
     mCxQNP:0//Average not published comments per question
    };

  models.Quiz.findAll({
    include: [{model: models.Comment}]
  })
  .then(function (found){
    var i=0;var j=0;var fP=0;var fNP=0;var fUser=0;
    for (i in found){
      //All questions
      statistics.nQ++;
      if(req.session.user && found[i].UserId === req.session.user.id){
        fUser=1;
        MYstatistics.nQ++;
      }
      if(found[i].Comments[0]){
        //Comment found
        statistics.nQwC++;if(fUser){MYstatistics.nQwC++;}
        while(found[i].Comments[j]){
          statistics.nCPandNP++;if(fUser){MYstatistics.nCPandNP++;}
          if(found[i].Comments[j].publicado){
            statistics.nCP++;if(fUser){MYstatistics.nCP++;}
            if(!fP) {
              fP=1;
            }
          }else{
            statistics.nCNP++;if(fUser){MYstatistics.nCNP++;}
            if(!fNP) {
              fNP=1;
            }
          }
          j++;
        }
        j=0;

        if(fP===1 && fNP===0){
          statistics.nQwACP++;if(fUser){MYstatistics.nQwACP++;}
        }

        if(fP===0 && fNP===1){
          statistics.nQwACNP++;if(fUser){MYstatistics.nQwACNP++;}
        }

        fP=0;fNP=0;

      }else{
        //No comment found
        statistics.nQwNC++;if(fUser){MYstatistics.nQwNC++;}
      }
      fUser=0;
    }

    if(statistics.nQ > 0){
      statistics.mCxQ= (statistics.nCPandNP/statistics.nQ).toFixed(2);
      statistics.mCxQP=(statistics.nCP/statistics.nQ).toFixed(2);
      statistics.mCxQNP=(statistics.nCNP/statistics.nQ).toFixed(2);
    }

    if(MYstatistics.nQ > 0){
      MYstatistics.mCxQ= (MYstatistics.nCPandNP/MYstatistics.nQ).toFixed(2);
      MYstatistics.mCxQP=(MYstatistics.nCP/MYstatistics.nQ).toFixed(2);
      MYstatistics.mCxQNP=(MYstatistics.nCNP/MYstatistics.nQ).toFixed(2);
    }

    res.render('quizes/statistics', {statistics: statistics,MYstatistics: MYstatistics, errors: []});
  })
  .catch (function(error){
      next(error);
    });
};
