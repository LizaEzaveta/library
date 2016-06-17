var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database.js');
var configAuth = require('./auth');
var connection = mysql.createConnection(dbconfig.connection);

// expose this function to our app using module.exports
module.exports = function(passport) {

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    done(null, id);
  });

  // =========================================================================
  // FACEBOOK ================================================================
  // =========================================================================
  passport.use(new FacebookStrategy({
      // pull in our app id and secret from our auth.js file
      clientID: configAuth.facebookAuth.clientID,
      clientSecret: configAuth.facebookAuth.clientSecret,
      callbackURL: configAuth.facebookAuth.callbackURL
    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

      // asynchronous
      process.nextTick(function() {
        connection.query("SELECT * from fb_user where id=" + profile.id, function(err, rows, fields) {
          if (err) done(err);
          if (rows.length === 0) {
            var newFbUser = {
              id: profile.id,
              email: profile.emails /*[0].value*/ ,
              firstname: profile.displayName,
              secondname: profile.name.familyName,
              token: token
            };
            var insertQuery = 'INSERT INTO fb_user SET ?';
            connection.query(insertQuery, newFbUser, function(err, rows) {
              if (err) throw err;
              return done(null, newFbUser);
            });
          } else {
            return done(null, rows[0]);
          }
        });
      });
    }));

  // =========================================================================
  // GOOGLE + ================================================================
  // =========================================================================
  passport.use(new GoogleStrategy({
      clientID: configAuth.googleAuth.clientID,
      clientSecret: configAuth.googleAuth.clientSecret,
      callbackURL: configAuth.googleAuth.callbackURL,
    },
    function(token, refreshToken, profile, done) {
      process.nextTick(function() {
        // try to find the user based on their google id
        connection.query("SELECT * from fb_user where id=" + profile.id, function(err, rows, fields) {
          if (err)
            return done(err); 
          if (rows.length === 0) {
            var newGglUser = {
              id: profile.id,
              email: profile.emails[0].value,
              firstname: profile.displayName,
              secondname: profile.name.familyName,
              token: token
            };
            var insertQuery = 'INSERT INTO fb_user SET ?';
            connection.query(insertQuery, newGglUser, function(err, rows) {
              if (err) throw err;
              return done(null, newGglUser);
            });
          }
          else {
            // if a user is found, log them in
            return done(null, rows[0]);
          }
        });
      });

    }));

  // =========================================================================
  // LOCAL ================================================================
  // =========================================================================
  passport.use('local-signup', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      connection.query("select * from user where email = '" + email + "'", function(err, rows) {
        if (err)
          return done(err);
        if (rows.length) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {

          // if there is no user with that email
          // create the user
          var newUserMysql = {
            email: email,
            firstname: req.body.firstname,
            secondname: req.body.secondname,
            age: 21,
            tel: req.body.tel,
            password: bcrypt.hashSync(password, null, null)
          };
          var insertQuery = 'INSERT INTO user SET ?';
          connection.query(insertQuery, newUserMysql, function(err, rows) {
            if (err) throw err;
            newUserMysql.id = rows.insertId;

            return done(null, newUserMysql);
          });
        }
      });
    }));

  passport.use(
    'local-login',
    new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      function(req, email, password, done) { // callback with email and password from our form
        connection.query("SELECT * FROM user WHERE `email` = '" + email + "'", function(err, rows) {
          if (err)
            return done(err);
          if (!rows.length) {
            return done(null, false, req.flash('loginMessage', 'No user found.'));
          }

          // if the user is found but the password is wrong
          if (!bcrypt.compareSync(password, rows[0].password))
            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

          // all is well, return successful user
          return done(null, rows[0]);
        });
      })
  );
};
