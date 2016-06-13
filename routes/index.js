var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var fs = require("fs");
var multiparty = require('multiparty');

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

router.get('/upload', function(req, res) {
  res.render('upload');
});

router.post('/upload', function(req, res) {

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

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/library', function(req, res) {
  res.render('book');
});

router.get('/login', function(req, res) {
  res.render('login');
});
router.get('/registration', function(req, res) {
  res.render('registration');
});

router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));

module.exports = router;
