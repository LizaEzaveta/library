var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var fs = require('fs');
var path = require('path');

exports.up = function(db, callback) {
  db.createTable('book', {
    id: {
      type: 'int',
      primaryKey: true,
      notNull: true
    },
    series_id: { type: 'int', notNull: true },
    /*series_id: {
      type: 'int',
      unsigned: true,
      length: 10,
      notNull: true,
      foreignKey: {
        name: 'book_series_id_fk',
        table: 'series',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },*/
    name: 'string',
    year: 'int',
    pages: 'int',
    file: 'string',
    min_age: 'int',
    date: 'datetime',
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('book', callback);
};
