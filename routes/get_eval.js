/*------------------------------------------------
  　ライブラリ，自己定義ファイル読み込み
-------------------------------------------------*/
var async      = require('async');

/*------------------------------------------------
  　評価数取得する
-------------------------------------------------*/
module.exports = function(req , res) {



  var post_id = req.query.post_id;
  var count = 0;

  async.series([
   function(callback) {
      select_eval(req,res, post_id)
      callback(null);
   }],
   function() {
   });
};

/*------------------------------------------------
  　テーブルから評価数を取り出す
-------------------------------------------------*/
function select_eval(req, res, post_id) {
  var connection = require('../helper/db_helper').connection();

  var count = 0;
  var eval = "false"; //自分が評価したか

  async.series([
    function(callback){
      var place = 'select count(*) as count from Eval where post_id = ?';
      var query = connection.query(place, parseInt(post_id));
      query
        .on('error' , function(err) {
          console.log(err);
          console.log("評価データ取り出し中にエラー");
        })
        .on('result' , function(rows) {
          if(rows != null) {
            console.dir(rows);
            count = rows.count;
          } else {
          }
        })
        .on('end' , function() {
          callback(null);
        });
    },function(callback){
      console.log(req.user);
      var eval_array = [
        post_id, req.user
      ];

      var place = 'select * from Eval where post_id = ? and twitter_id = ?';
      var query = connection.query(place, eval_array);

      query
        .on('error' , function(err) {
          console.log(err);
          console.log("評価データ取り出し中にエラー（ユーザ情報）");
        })
        .on('result' , function(rows) {
          if(rows != null) {
            console.dir(rows);
            if(rows.length != 0) {
              eval = "true";
            } else {
              eval = "false";
            }
          } else {
          }
        })
        .on('end' , function() {
          callback(null);
        });
    }], function() {
      console.log(count);
      res.send({
        count : String(count),
        eval  : eval
      });
    });
}
