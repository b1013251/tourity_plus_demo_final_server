/*#################################################

  　ARの関連するサポートをする関数

#################################################*/

//地球の半径
var R = 6371 * 1000;

/*------------------------------------------------
  　距離の範囲内に観測物が存在しているか返す
-------------------------------------------------*/
exports.is_in_a_range = function(viewLat , viewLon , posLat , posLon , range) {
    return distance(viewLat , viewLon , posLat , posLon) < range;
}

/*------------------------------------------------
  　プライベート関数：２点間の距離を測る
-------------------------------------------------*/
function distance(viewLat , viewLon , posLat , posLon) {
    var radViewLat = viewLat * Math.PI / 180.0;
    var radViewLon = viewLon * Math.PI / 180.0;
    var radPosLat  = posLat  * Math.PI / 180.0;
    var radPosLon  = posLon  * Math.PI / 180.0;
    return Math.acos( Math.sin(radViewLon) * Math.sin(radPosLon) +
                      Math.cos(radViewLon) * Math.cos(radPosLon) *
                      Math.cos(radPosLat - radViewLat)) * R;
}
