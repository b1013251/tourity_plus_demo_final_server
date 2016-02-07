/*------------------------------------------------
  　ライブラリ読み込み
-------------------------------------------------*/
var http = require('http');
var socketIO   = require('socket.io')

/*------------------------------------------------
  　自己定義ファイル読み込み
-------------------------------------------------*/
var settings       = require('./settings.js');
var locationHelper = require('./helper/location_helper.js');

/*------------------------------------------------
  　初期化（サーバの挙動を定義し，リスン状態に）
-------------------------------------------------*/

var user = [];

var init = function(app){

  io = socketIO.listen(app);
  io.sockets.on("connection" , function(socket) {
    console.log("connected");

    //接続時にユーザ情報を追加
    user[socket.id] = {
      latitude  : 0 ,
      longitude : 0
    };

    // 切断時
    socket.on("disconnect" , function() {
      console.log("disconnected");
      delete user[socket.id];
    });

    // 位置情報を受け取った時，近辺のバブルを返す．
    socket.on("location_server" , function(location) {
      user[socket.id].latitude  = location.latitude;
      user[socket.id].longitude = location.longitude;
      //全データから検索し，emitする
      emit_bubble(socket.id , location);
    });
  });
};

function emit_bubble(id, location) {

  var count = 0;
  var connection = require('./helper/db_helper').connection();
  var query = connection.query('select * from Post');
  query
  .on('error', function(err){
    console.log(err);
  })
  .on('fields', function(fields) {
  })
  .on('result', function(row) {
    connection.pause();

    console.log(id + " " + location.latitude + " " + location.longitude + " " + row.message);

    if (/*
      locationHelper.is_in_a_range(
        row.latitude , row.longitude ,
        location.latitude , location.longitude , location.range
      )*/ true
    ) {
      io.to(id).emit("message_bubbles" , row );

      count++;
    }

    connection.resume();

  })
  .on('end', function() {
    console.log("finished.");
    console.log(count + "points");
  });
}

exports.broadcast_bubble = function() {
  console.log("ブロードキャストします．");
  for(key in user) {

    emit_bubble(key,
      {latitude: user[key].latitude,
       longitude : user[key].longitude}
     );
  }
}

exports.init = init;
