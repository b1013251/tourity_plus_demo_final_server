/*

  ランダムに位置情報をデータベースに追加する

*/
var mysql   = require("mysql");

var connection = mysql.createConnection({
  host     : 'localhost' ,
  user     : 'node' ,
  password : 'secret' ,
  database : 'node'
});

var str_array = [
"こんにちは",
"綺麗",
"美しい",
"楽しい",
"辛い",
"寒い",
"熱い",
"心が落ち着く",
"yeee"
];

/* ---------------------------
 *          関数
 * --------------------------- */
function toOrdinal(num) {
	if (num % 10 == 1 && num != 11) {
		return num + "st";
	} else if (num % 10 == 2 && num != 12) {
		return num + "nd";
	} else {
		return num + "th";
	}
}


/* ---------------------------
 *          データ準備
 * --------------------------- */
var oriLat = 41.842022;
var oriLon = 140.766769;
var oriAlt = 0.0;

var lat = [];
var lon = [];
var alt = [];
var str = [];

for (var i = 0 ; i < 10 ; i++) {
	lat[i] = oriLat + (Math.random() - 0.5) * 0.01;
	lon[i] = oriLon + (Math.random() - 0.5) * 0.01;
	alt[i] = oriAlt + (Math.random() ) * 50.0;
	str[i] = str_array[i % str_array.length];

}


/* ---------------------------
 *          MySQL
 * --------------------------- */
console.log("接続を開始します。");

connection.connect(function(err) {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
})

for(var i = 0 ; i < 100 ; i ++ ) {

  var jsonData = {
    latitude : lat[i]  ,
    longitude : lon[i] ,
    altitude : alt[i]  ,
    message : str[i]   ,
<<<<<<< HEAD
    file_path : "tmp/sample.jpg",
=======
    file_path : "/sample.jpg",
>>>>>>> 7534b159ea5096da907678ec830eae065e98f24a
    user_id    : 1
  };
  var query = 'insert into Post set ?';

  var realQuery = connection.query(query , jsonData , function(err, result) {
    if(err != null) {
       console.log("Error");
    }
  });
  console.log(realQuery);
}


connection.end();
