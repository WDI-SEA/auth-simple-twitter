'use strict';
var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    username: DataTypes.STRING,
    password: {
      type:DataTypes.STRING,
      validate: {
        len: [8, 99]
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        models.user.hasMany(models.tweet);
      },
      authenticate: function(username, password, callback) {
        // find the user in the database
        this.find({where: {username: username}}).then(function(user) {
          // if there's no username with the username then raise a 'no user' error
          if (!user) callback(null, false);
          // if a user record comes back, compare the password to the hash
          bcrypt.compare(password, user.password, function(err, result) {
            // if there's a database error then raise 'sorry, something went wrong'
            if (err) return callback(err);
            // the passwords match. return the user info
            if (result) {
              callback(null, user);
            // otherwise, raise a 'wrong password' error
            // the password is incorrect.
            }  else {
              callback(null, false);
            }
          })
        }).catch(callback);
      }
    }, 
    hooks: {
      beforeCreate: function(user, options, callback) {
        // if the user gave a password then hash it
        if (user.password) {
          // hash the plaintext password before saving.
          bcrypt.hash(user.password, 10, function(err, hash) {
            if (err) return callback(err);
            user.password = hash;
            callback(null, user);
          });
        // the user didn't provide a password
        } else {
          callback(null, user);
        }
      }
    }
  });
  return user;
};