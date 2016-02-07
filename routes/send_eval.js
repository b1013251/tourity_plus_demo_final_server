/*------------------------------------------------
  　ライブラリ，自己定義ファイル読み込み
-------------------------------------------------*/
var async      = require('async');

/*------------------------------------------------
  　評価ボタンを押した時に，評価を増やす
-------------------------------------------------*/
module.exports = function(req , res) {
  var post_id = req.body.post_id; //GETパラメータから取得
  var user_id = req.user;          //セッションから取得

  var exist_error = false;         //エラーチェック用

  async.series([
    function(callback) {
      exist_error = insert_eval(post_id,user_id,exist_error);
      callback(null);
    }
  ], function() {
    if(!exist_error) {
      res.send("ok"); //成功時okを返す
    } else {
      res.send("ng"); //失敗時ngを返す
    }
  });
}

/*------------------------------------------------
  プライベート関数：評価データをテーブルに追加
  - post_idとtwitter_idは同じ!!!
-------------------------------------------------*/
function insert_eval(post_id, user_id) {
  var connection;
  var exist_error = false; //エラーが発生しているか

  async.waterfall([
    // コネクション確立
    function(callback) {
      connection = require('../helper/db_helper').connection();
      callback(null);
    },
    function(callback) {
      var eval_array = [
        post_id, user_id
      ];
      var place = 'select * from Eval where post_id = ? and twitter_id = ?';

      var exist_eval = true;
        var query = connection.query(place, eval_array, function(err,result){
          if(err != null) {
            console.log("評価追加中，評価チェック中エラーが発生しました。");
            exist_error = true;
          } else if(result.length != 0){
            console.log("評価はすでにされている");
            console.dir(result);
            exist_eval = true;
            callback(null, exist_eval);
          } else {
            console.log("評価されていなかった");
            exist_eval = false;
            callback(null, exist_eval);
          }
        });
    },
    // クエリー文の生成・実行
    function(exist_eval , callback) {
      console.log(exist_eval);
      var eval = {
        twitter_id : user_id,
        post_id    : parseInt(post_id)
      };
      var place      = 'insert into Eval set ?';

      if(!exist_eval) {
        connection.query(place, eval, function(err, result){
          if(err != null) {
            console.log("評価追加中，エラーが発生しました．");
            exist_error = true;
          } else {
            //データの挿入成功
          }
        });
      }

      callback(null);
    }
  ],function() {
    return exist_error;
  });
};
