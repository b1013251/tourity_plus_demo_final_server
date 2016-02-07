/*

  遺産コード

  いつか使うかもしれにから残しておいてるコードなので
  今は使われていません
  発掘していく用

*/

//ミドルウェア・ライブラリ読み込み
var formidable = require('formidable');
var twitter = require('twitter');
var fs      = require('fs');
var async   = require('async');
var url     = require('url');

var settings   = require('./settings.js');
var mariadb    = require('./mariadb.js');



/*------------------------------------------------
  Twitterの内容から取得してデータベースに保存
-------------------------------------------------*/
function get_rand() {
  var alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTLVWXYZ0123456789";
  var randString = "";
  for(var i = 0 ; i < 20 ; i ++) {
    randString += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return randString;
}

function set_cookie(req,res,str) {
  res.cookie('Session-Cookie', str , {maxAge:60000, httpOnly:false});
  res.send("ok");
}

exports.get_token = function(req, res){
 console.log("received");
 console.log(req.body.authToken);
 console.log(req.body.authTokenSecret);

 var client = new twitter({
   consumer_key        : "sshdXxA0xlIb5Npj9z9RUffhC",
   consumer_secret     : "EQWWHDGt2jWps3W5ng8uGqNViajCVCDVlLn7PTvU6nNoTP3kJe",
   access_token_key    : req.body.authToken,
   access_token_secret : req.body.authTokenSecret,
 });
 var params = {};
 client.get('account/settings', params , function(error , tweet , response) {
   //if(error != null) return;

   console.log(tweet);

   var exist = null;

   mariadb.init();
   async.waterfall([
     function(callback) {
        mariadb.check_user(tweet.screen_name , callback);
     },
     function(is_exist, callback) {
       console.log("user existed? : " + is_exist);
       if(is_exist == false) {
        var cookie_str = get_rand();
        mariadb.add_user(tweet.screen_name , cookie_str);
        set_cookie(req,res,cookie_str);
        callback(null,"second");
      } else  {
         var cookie_str = get_rand();
         mariadb.update_user(tweet.screen_name , cookie_str);
         set_cookie(req,res,cookie_str);
         callback(null,"second");
      }
    }
   ]);
 });
}


/*------------------------------------------------
  クッキーでセッションIDを受け取りデータベース参照
-------------------------------------------------*/


/*------------------------------------------------
  マイページ用のデータを渡す
-------------------------------------------------*/
exports.user_info = function(req , res) {
  var cookie = req.headers.cookie.split("=")[1];
  mariadb.init();
  async.waterfall([
   function(callback) {
      checkSession(cookie, callback);
   },
   function(user_info , callback) {
     if(user_info != null) {
       res.send(user_info);
     } else {
       res.send("nothing");
     }
   }
 ]);
}
