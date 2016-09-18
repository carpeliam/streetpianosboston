define(function() {
  'use strict';
  var R = 6371; // km
  function rad(x) {
    return x * Math.PI / 180;
  }
  return function(pos1, pos2) {
    var x1 = pos2.latitude - pos1.latitude;
    var dLat = rad(x1);
    var x2 = pos2.longitude - pos1.longitude;
    var dLon = rad(x2);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(rad(pos1.latitude)) * Math.cos(rad(pos2.latitude)) *
                    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d;
  };
});
