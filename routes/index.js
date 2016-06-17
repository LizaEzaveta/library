var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var fs = require("fs");
var multiparty = require('multiparty');
var checkAuth = require('../middleware/checkAuth');

module.exports = function(app, passport) {

app.get('/upload', function(req, res) {
  res.render('upload');
});

app.post('/upload', function(req, res) {

/*  if(req.busboy) {
        req.busboy.on("file", function(fieldName, fileStream, fileName, encoding, mimeType) {
            //Handle file stream here
        });
        return req.pipe(req.busboy);
    }
*/

  var form = new multiparty.Form();
  var uploadFile = { uploadPath: '', type: '', size: 0 };
  var maxSize = 2 * 1024 * 1024; //2MB
  var supportMimeTypes = ['image/jpg', 'image/jpeg', 'image/png'];
  var errors = [];

  form.on('error', function(err) {
    if (fs.existsSync(uploadFile.path)) {
      fs.unlinkSync(uploadFile.path);
      console.log('error');
    }
  });

  form.on('close', function() {
    if (errors.length == 0) {
      res.send({ status: 'ok', text: 'Success' });
    } else {
      if (fs.existsSync(uploadFile.path)) {
        fs.unlinkSync(uploadFile.path);
      }
      res.send({ status: 'bad', errors: errors });
    }
  });

  // listen on part event for image file
  form.on('part', function(part) {
    uploadFile.size = part.byteCount;
    uploadFile.type = part.headers['content-type'];
    uploadFile.path = './files/' + part.filename;

    console.log("filename=",part.filename);

    if (uploadFile.size > maxSize) {
      errors.push('File size is ' + uploadFile.size / 1024 / 1024 + '. Limit is' + (maxSize / 1024 / 1024) + 'MB.');
    }

    if (supportMimeTypes.indexOf(uploadFile.type) == -1) {
      errors.push('Unsupported mimetype ' + uploadFile.type);
    }

    if (errors.length == 0) {
      var out = fs.createWriteStream(uploadFile.path);
      part.pipe(out);
    } else {
      part.resume();
    }
  });
  // parse the form
  form.parse(req);
});

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/book', function(req, res) {
  res.render('book');
});

app.get('/library', function(req, res) {
  res.render('booklist');
});

app.get('/profile', /*checkAuth,*/ function(req, res) {
  console.log("to get comes="+JSON.stringify(req.user));
  /*res.locals.user = req.user;*/
  res.render('profile', {
    user : req.user // get the user out of session and pass to template
  });
});

app.post('/change_profile', function(req, res) {
  console.log("res="+req.body.res);
  /*res.render('profile');*/
});

app.get('/auth/facebook', passport.authenticate('facebook', { scope:'email'  }));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

app.get('/login', function(req, res) {
  res.render('login', { message: req.flash('loginMessage') });
});

app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }),
  function(req, res) {
    console.log("hello");

    if (req.body.remember) {
      req.session.cookie.maxAge = 1000 * 60 * 3;
    } else {
      req.session.cookie.expires = false;
    }
    res.redirect('/');
  }
);

app.get('/registration', function(req, res) {
  res.render('registration',  { message: req.flash('signupMessage') });
});

// process the signup form
app.post('/registration', passport.authenticate('local-signup', {
  successRedirect: '/profile', // redirect to the secure profile section
  failureRedirect: '/registration', // redirect back to the signup page if there is an error
  failureFlash: true // allow flash messages
}));

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}
};

/*module.exports = router;*/