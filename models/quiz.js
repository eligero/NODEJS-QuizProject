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
      }
    }
  );
};
