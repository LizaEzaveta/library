var express = require('express');
var app = express();
var path = require("path");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var mysql = require('mysql');
var db = require('node-mysql');
var DB = db.DB;
var BaseRow = db.Row;
var BaseTable = db.Table;

app.use(express.static(path.join(__dirname, 'views')));

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*var box = new DB({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'library'
});*/
var lb = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: '12345',
  database : 'library'
});

lb.connect(function (err) {
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
})


var book = { book_name: 'Winnie Pooh', book_year:'1990-01-01 00:00:00', book_pages: 150 };
lb.query('INSERT INTO Book SET ?', book, function(err,res){
  if(err) throw err;

  console.log('Last insert ID:', res.insertId);
})

lb.end(function(err) {
  if(err){
    console.log('Error ending the connection to Db');
    return;
  }
  console.log('Connection ended');
});

app.use('/', routes);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

module.exports = app;