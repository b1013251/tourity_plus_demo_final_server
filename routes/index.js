/*#################################################

  　案内所（ファイルを読み込み/index.jsに渡す）

#################################################*/

module.exports = {
  upload        : require('./upload'),         //感想投稿
  user_info     : require('./user_info'),      //マイページ
  get_eval      : require('./get_eval'),       //評価情報取得
  send_eval     : require('./send_eval'),      //評価情報更新
  check_user    : require('./check_user'),     //初回のログインチェック
  past_image    : require('./past_image'),

  check_session : require('./check_session')   //セッションチェック
};
