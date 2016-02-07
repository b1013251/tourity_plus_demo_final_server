/*------------------------------------------------
  　ライブラリ，自己定義ファイル読み込み
-------------------------------------------------*/
var passport = require('passport')
var TwitterStrategy = require('passport-twitter').Strategy;
var settings = require('./settings');
var async    = require('async');

/*------------------------------------------------
  　Passport 設定
-------------------------------------------------*/[
/*
passport.serializeUser(function(user , done) {
  done(null , user.id);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new TwitterStrategy({
    consumerKey    : settings.CONSUMER_KEY,
    consumerSecret : settings.CONSUMER_SECRET,
    callbackURL    : settings.HOST + "/callback"
  },
  function(token , tokenSecret , profile , done) {
      //認証完了時にデータベースに保存
      var connection;
      var user_exist;

      console.dir(profile);

      async.series([
        function(callback) {
          connection = require('./helper/db_helper').connection();
          passport.session.id   = profile.id;
          passport.session.user = profile.username;
          callback(null);
        },
        //ユーザ既に存在しているか
        function(callback) {
          var place = 'select * from User where twitter_id = ?';
          var query = connection.query(place, profile.username , function(err, result) {
            if(err != null) {
              console.log("ユーザ探索中エラーが発生");
              callback(null);
            } else if(result.length == 0) {
                user_exist = false; //ユーザが不在
                console.log("ユーザ不在");
                callback(null);
            } else {
                user_exist = true; //ユーザ存在
                callback(null);
            }
          });
        },
        //ユーザを追加（ユーザ不在時）
        function(callback) {
          if(!user_exist) {
            var user_data = {
              twitter_id : profile.username,
              cookie     : profile.id
            };
            var place = 'insert into User set ?';
            var query = connection.query(place, user_data, function(err, result) {
              if(err != null) {
                console.log("ユーザ追加中，データの挿入に失敗しました。");
                callback(null);
              } else {
                // データの挿入成功！
                callback(null);
              }
            });
          } else {
            callback(null);
          }
        },
        //セッションを更新（ユーザが既に存在している場合）
        function(callback) {
          if(user_exist) {
            console.log("ユーザは2度目以降のログインのため、追加しませんよ。");
            callback(null);
          } else {
            callback(null);
          }
        }
      ],function(err, results) {
        if (err) {
          throw err;
        }
        process.nextTick(function() {
          return done(null,profile);
        });
      });
  }
));

exports.passport = passport;
*/
