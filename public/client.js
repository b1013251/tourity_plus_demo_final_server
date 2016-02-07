$(document).ready(function() {
  //websocket部分
  var socket = io.connect("http://localhost:3000");

  //バブルプール
  var bubblePool = []

  //レンジ
  var range = 0.0;

  socket.on('connect' , function() {
    console.log("connected");
  });

  socket.on('disconnect' , function() {
    console.log("disconnected");
  });

  socket.on('message' , function(data) {
    $('#show_message').append("<p>" + data.message + " " + data.date + "<br>" +
      data.latitude + " , " + data.longitude + "</p>");
  });

  socket.on('message_bubbles' , function(bubble) {
    if(!bubblePool[bubble._id]) { //既に存在していれば追加しない
      bubblePool[bubble.student_id] = bubble
      $('#message_bubbles').append('<p>'+ bubble.latitude  +
          ' ' + bubble.longitude　+ ' ' + bubble.message + '</p>');
    }
  });
/* 配列で受け取るバージョン
  socket.on('message_bubbles' , function(bubbles) {
    console.log("receive bubbles");
    console.dir(bubbles);
    for(var i = 0 ; i < bubbles.length ; i++ ) {
      $('#message_bubbles').append('<p>'+ bubbles[i].latitude +
        ' ' + bubbles[i].longitude + ' ' + bubbles[i].message + '</p>');
    }
  });
*/

  //デバッグ用にwebsocketで投稿できるようにしているー＞本番環境では通常のhttp要求
  /*
  $('#send_message').submit(function() {
    console.log("message submitted");
    var jsonData = {
      "message" : $('#send_message [name=message]').val() ,
      "latitude"  : Number($('#send_message [name=latitude]').val() || 0) ,
      "longitude"   : Number($('#send_message [name=longitude]').val() || 0) ,
      "date"    : new Date() ,
      "media"     : $('#send_message [name=media]:checked').val()
    }
    socket.emit('message_server' , jsonData);
    return false;
  });
  */

  //位置情報を送信
  $('#send_location').submit(function() {
    if(range != Number($('#send_location [name=range]').val() || 0)) {
      //範囲が変わったらリセット
      bubblePool = [];
      $('#message_bubbles').empty();
    }
    console.log("location submitted");
    var jsonData = {
      "latitude"  : Number($('#send_location [name=latitude]').val() || 0) ,
      "longitude"   : Number($('#send_location [name=longitude]').val() || 0),
      "range"     : Number($('#send_location [name=range]').val() || 0),
    }
    socket.emit('location_server' , jsonData);
    return false;
  });
});

/*

最終目標
・緯度                     : latitude
・経度                     : longitude
・メッセージ内容            : message
・添付画像（URLで送る？）    : media
・投稿時間                 : date

*/
