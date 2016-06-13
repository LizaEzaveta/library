var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var fs = require('fs');
var path = require('path');

exports.up = function(db, callback) {
 /* var filePath = path.join(__dirname + '/sqls/20160606130653-add-comment-up.sql');
  fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
    if (err) return callback(err);
      console.log('received data: ' + data);

    db.runSql(data, function(err) {
      if (err) return callback(err);
      callback();
    });
  });*/
/*  db.addForeignKey('comment', 'user', 'user_id_fk', 
  {
    'user_id': 'id'
  }, 
  {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT'
  }, callback);

  db.addForeignKey('comment', 'book', 'book_id_fk',
  {
    'book_id': 'id'
  },
  {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT'
  }, callback);*/
  db.createTable('comment', {
    id: { type: 'int', primaryKey: true, notNull: true },
    user_id: { type: 'int', notNull: true },
    book_id: { type: 'int', notNull: true },
    /*user_id: {
      type: 'int',
      unsigned: true,
      length: 10,
      notNull: true,
      foreignKey: {
        name: 'comment_user_id_fk',
        table: 'user',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    book_id: {
      type: 'int',
      unsigned: true,
      length: 10,
      notNull: true,
      foreignKey: {
        name: 'comment_book_id_fk',
        table: 'book',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },*/
    text: 'string',
    date: 'datetime',
  }, callback);

};

exports.down = function(db, callback) {
  db.dropTable('comment', callback);
};
