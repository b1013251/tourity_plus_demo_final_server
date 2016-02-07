/*

  Tourity+ for iOS
  企業発表用 デモ

  created : in 2016/2/7 by b1013251

*/


/*------------------------------------------------
  　ライブラリ読み込み
-------------------------------------------------*/
var express           = require('express');
var http              = require('http');
var util              = require('util');
var json              = require('json');
var bodyParser        = require('body-parser');
var methodOverride    = require('method-override');
var fs                = require('fs');
var session           = require('express-session');
var SessionStore      = require('express-mysql-session');

/*------------------------------------------------
  　自己定義ファイル読み込み
-------------------------------------------------*/
var settings   = require('./settings.js');
var routes     = require('./routes');

/*------------------------------------------------
  　HTTPサーバ設定
-------------------------------------------------*/
var app = express();
var server = http.createServer(app);
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/tmp')   ); //あとで/var/www/html/imageに変更
app.use(bodyParser());
app.use(methodOverride());

//セッションをmysqlに保存する方式に

var session_options = {
  host : 'localhost',
  port : 3306,
  user : 'node',
  password : 'secret' ,
  database : 'node'
};

app.use(session({
  secret : 'koreha_hash_no_salt_kana',
  store  : new SessionStore(session_options)
}));


/*------------------------------------------------
  　ルーティング作業　（routes/index.jsから）
-------------------------------------------------*/
// ユーザ認証不要
// デモのため，セッションチェックをスルーするように変更

app.post('/upload'     , routes.upload);
app.post('/send_eval'  , routes.send_eval);
app.get ('/check_user' , routes.check_user);
app.get ('/user_info'  , routes.user_info);
app.get ('/get_eval'   , routes.get_eval);

app.get ('/past_image' , routes.past_image);

/*------------------------------------------------
  　WebSocketサーバをリスン状態に
-------------------------------------------------*/
var websocket = require('./websocket.js');
websocket.init(server);

/*------------------------------------------------
  　サーバをリスン状態に
-------------------------------------------------*/
server.listen(settings.PORT , '0.0.0.0');
