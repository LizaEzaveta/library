var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var fs = require('fs');
var path = require('path');
var async = require('async');

exports.up = function(db, callback) {
/*  var filePath = path.join(__dirname + '/sqls/20160606124217-add-author-up.sql');
  fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
    if (err) return callback(err);
      console.log('received data: ' + data);

    db.runSql(data, function(err) {
      if (err) return callback(err);
      callback();
    });
  });*/

  db.createTable('author', {
    id: { type: 'int', primaryKey: true, notNull: true,  autoIncrement: true},
    firstname: 'string',
    secondname: 'string',
    biography: 'string'
  }, callback);
};

exports.down = function(db, callback) {
/*  var filePath = path.join(__dirname + '/sqls/20160606124217-add-author-down.sql');
  fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
    if (err) return callback(err);
      console.log('received data: ' + data);

    db.runSql(data, function(err) {
      if (err) return callback(err);
      callback();
    });
  });*/
  db.dropTable('author', callback);
};
