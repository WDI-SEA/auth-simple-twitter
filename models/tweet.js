'use strict';
module.exports = function(sequelize, DataTypes) {
  var tweet = sequelize.define('tweet', {
    content: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.tweet.belongsTo(models.user);
      }
    }
  });
  return tweet;
};