module.exports = function(sequelize, DataTypes){
  return sequelize.define(
    'Comment',{
      text:{
        type: DataTypes.STRING,
        validate: {notEmpty: {msg: "Type a comment!"}}
      },
      published: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    }
  );
};
