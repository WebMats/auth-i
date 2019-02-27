const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userDB = require('../data/dbConfig');
const bcrypt = require('bcryptjs');
const checkValidity = require('../services/authValidation');


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
    if (!checkValidity(email, {required: true, isEmail: true }) || !checkValidity(password, {required: true})) {
        return done("Please provide valid email and password", false)
    }
    userDB('users').where({email}).first().asCallback(function(err, user) {
        if (err) return done(err, false);
        if (!user) return done(null, false);
        bcrypt.compare(password, user.hash).then(isMatch => {
            if (isMatch) {
                return done(null, user.email)
            } else {
                done(null, false)
            }
        })
    });
}))
passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    if (!checkValidity(email, {required: true, isEmail: true }) || !checkValidity(password, {required: true})) {
        return done("Please provide valid email and password", false)
    }
    userDB('users').where({email}).first().asCallback(function(err, user) {
        if (err) return done(err, false);
        if (user) return done(null, false);
        bcrypt.hash(password, 11).then( async (hash) => {
            const newUser = {email, hash}
            try {
                const [id] = await userDB('users').insert(newUser);
                done(null, email)
            } catch (err) {
                console.log(err)
                done("Could not register the user.", false)
            }
        }).catch(err => {
           console.log(err)
           done("Could not register the user.", false)
        });
    });
}))