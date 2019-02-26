const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userDB = require('../data/dbConfig');
const bcrypt = require('bcryptjs');


passport.serializeUser(function(email, done) {
    done(null, email);
  });
  
  passport.deserializeUser(async function(email, done) {
      try {
        const user = await userDB('users').where({email}).first();
        done(null, email);
      } catch (err) {
        console.log(err);
        done(err, false);
      }

  });


passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    userDB('users').where({email}).first().asCallback(function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (!user) {
            return done(null, false);
        }
        bcrypt.compare(password, user.hash).then(isMatch => {
            if (isMatch) {
                return done(null, user.email)
            } else {
                done(null, false)
            }
        })
    });
}))