/*------------------------------------------------
  セッションチェック
-------------------------------------------------*/
module.exports = function(req , res, next) {
  var passport = require("./../index").passport
  if(passport.session && passport.session.id) {
    
    //リクエストにユーザに関するデータを付加
    req.user = passport.session.user;
    req.id   = passport.session.id;

    next();
  } else {
    console.log("ログインしていませんでした．");
    res.send('ng');
  }
}
