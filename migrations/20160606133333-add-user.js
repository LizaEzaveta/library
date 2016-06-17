var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var fs = require('fs');
var path = require('path');

exports.up = function(db, callback) {
  db.createTable('user', {
    id: {
      type: 'int',
      primaryKey: true,
      notNull: true,
      autoIncrement: true
    },
    firstname: 'string',
    secondname: 'string',
    password: 'string',
    email: 'string',
    age: 'int',
    tel: 'string'
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('user', callback);
};
