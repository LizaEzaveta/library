var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var fs = require('fs');
var path = require('path');

exports.up = function(db, callback) {
  db.createTable('fb_user', {
    id: {
      type: 'string',
      primaryKey: true,
      notNull: true,
    },
    firstname: 'string',
    secondname: 'string',
    email: 'string',
    token: 'string'
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('fb_user', callback);
};
