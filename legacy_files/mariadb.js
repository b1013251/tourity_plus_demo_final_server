var mysql   = require("mysql");
var locationHelper = require('./location_helper.js');
var async   = require('async');

var connection;

//初期化
exports.init = function() {
  connection = mysql.createConnection({
    host     : 'localhost' ,
    user     : 'node' ,
    password : 'secret' ,
    database : 'node'
  });

  connection.connect(function(err) {
    if (err) {
      console.log('error connecting: ' + err.stack);
      return;
    }
  });
}

//バブルを取得
exports.read_maria = function(id , location) {
  var count = 0;
  var query = connection.query('select * from Post');
  query
  .on('error', function(err){
    console.log(err);
  })
  .on('fields', function(fields) {
  })
  .on('result', function(row) {
    connection.pause();
    if (
      locationHelper.is_in_a_range(
        row.latitude , row.longitude ,
        location.latitude , location.longitude , location.range
      )
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

//投稿機能
exports.insert_maria = function(jsonData) {
  var query = 'insert into Post set ?';
  var realQuery = connection.query(query , jsonData , function(err, result) {
    if(err != null) {
       console.log("Error");
    }
  });
}

exports.check_user = function(screen_name , callback) {
  var query = 'select * from User where twitter_id = ?';
  var realQuery = connection.query(query , screen_name);
  var exist = false;

  realQuery
    .on('error' , function(err) {
      console.log(err);
      exist = false;
    })
    .on('result' , function(rows) {
      if(rows != null) {
        console.log(rows);
        exist = true;
      }
    })
    .on('end' , function() {
      console.log('check finish');
      console.log(exist);
      callback(null , exist);
    });
}

exports.add_user = function(screen_name , cookie_str) {
  jsonData = {
    twitter_id : screen_name,
    cookie     : cookie_str
  };

  var query = 'insert into User set ?';
  var realQuery = connection.query(query , jsonData , function(err, result) {
    if(err != null) {
       console.log("Error");
    }
  });
}


exports.update_user = function(callback ,cookie_str , new_cookie_str) {
  data = [
     new_cookie_str,
     cookie_str
  ];

  var query = 'UPDATE User SET cookie = ? WHERE cookie = ?';
  var sql = mysql.format(query , data);
  console.log(sql);
  var realQuery = connection.query(sql , function(err, result) {
    if(err != null) {
       console.log("Error update by mysql");
    }
    callback(null , true)
  });
}

exports.check_session = function(cookie , callback) {
  var query = 'select * from User where cookie = ?';
  var realQuery = connection.query(query , cookie);
  var exist = false;

  realQuery
    .on('error' , function(err) {
      console.log(err);
      exist = false;
    })
    .on('result' , function(rows) {
      if(rows != null) {
        console.log(rows);
        exist = true;
      }
    })
    .on('end' , function() {
      console.log('check session finish');
      console.log(exist);
      callback(null , exist);
    });
}

exports.get_user_info = function(cookie , callback) {
  var query = 'select * from User where cookie = ?';
  var realQuery = connection.query(query , cookie);

  var user_json;

  realQuery
    .on('error' , function(err) {
      console.log(err);
    })
    .on('result' , function(rows) {
      if(rows != null) {
        user_json = rows;
        console.log(rows);
      }
    })
    .on('end' , function() {
      console.log('user session finish');
      if(user_json == null) {
        console.log('error')
      }
      callback(null, user_json);
    });
}

exports.count_eval = function(callback , post_id) {
  var query = 'select count(*) as count from Eval where post_id = ?';
  var realQuery = connection.query(query, post_id);
  //console.log(post_id);
  var count;

  realQuery
    .on('error' , function(err) {
      console.log(err);
    })
    .on('result' , function(rows) {
      if(rows != null) {
        count = rows.count;
      }
    })
    .on('end' , function() {
      console.log('eval is ' + count);
      callback(null, count);
    });

}
