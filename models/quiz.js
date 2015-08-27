/* Quiz model definition */
module.exports = function(sequelize, DataTypes){
  return sequelize.define(
    'Quiz',{
      question: {
        type: DataTypes.STRING,
        validate: {notEmpty: {msg: "Type a Question!"}}
      },
      answer: {
        type: DataTypes.STRING,
        validate: {notEmpty: {msg: "Type an Answer!"}}
      },
      image:{
        type: DataTypes.STRING
      },
      theme:{
        type: DataTypes.STRING,
        validate: {
          isIn: {
            args: [['Other','Geography','Humanities','Leisure','Science',
            'Technology']],
            msg: "Select Theme!"
          }
        }
      }
    }
  );
};
