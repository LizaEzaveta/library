var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var fs = require('fs');
var path = require('path');

exports.up = function(db, callback) {
  db.createTable('series', {
    id: {
      type: 'int',
      primaryKey: true,
      notNull: true,
      autoIncrement: true
    },
    name: 'string'
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('series', callback);
};
