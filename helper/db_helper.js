/*#################################################

  　データベースに関連するサポートをする関数

#################################################*/
/*------------------------------------------------
  　ライブラリ，自己定義ファイル読み込み
-------------------------------------------------*/
var mysql = require('mysql');
var async = require('async');

/*------------------------------------------------
　データベースを返す
-------------------------------------------------*/
exports.connection = function() {
  var con;
  async.series([
    function(callback) {
      con = mysql.createConnection({
        host     : 'localhost' ,
        user     : 'node' ,
        password : 'secret' ,
        database : 'tourity',
        dateStrings: true
      });
      callback(null);
    },
    function(callback) {
      /*
      con.connect(function(err) {
        if (err) {
          console.log('データベース接続時エラー: ' + err.stack);
          callback(null);
        } else {
          console.log('データベース接続成功');
        }
      });
      */
      callback(null);
    }
  ], function() {
  });

  return con;
}
