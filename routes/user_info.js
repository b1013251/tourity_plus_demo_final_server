/*------------------------------------------------
  　ライブラリ，自己定義ファイル読み込み
-------------------------------------------------*/
var async      = require('async');
var settings   = require('../settings.js');

/*------------------------------------------------
  　ユーザ情報を返す
-------------------------------------------------*/
module.exports = function(req, res) {
  //TODO: ユーザ情報に評価数・被評価数を付加する

  console.log("Twitter Number" + req.id);
  select_user(req.id);
  res.send(req.id);
}


/*------------------------------------------------
  　データベースからユーザ情報を取得
-------------------------------------------------*/
function select_user(user_id) {
  var connection;
  var user_data;

  async.series([
    // コネクション確立
    function(callback) {
      connection = require('../helper/db_helper').connection();
      callback(null);
    },
    // クエリー文の生成・実行
    function(callback) {
      var place      = 'select * from User where cookie = ?';
      var query      = connection.query(place, user_id, function(err, result){
        if(err != null) {
          console.log("ユーザ情報取得中にエラーが発生しました。");
        } else {
          //データの挿入成功
          console.log("sqlの結果")
          console.dir(result);
          user_data = result;
        }
      });
      callback(null);
    }
  ]);
}
