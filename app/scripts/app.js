/*global define */
define(['backbone', 'model', 'locations', 'view', 'jquery'], function (Backbone, PianosCollection, locations, PianoView, $) {
  'use strict';
  var pianos = new PianosCollection(locations);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      // var coords = {latitude: position.coords.latitude, longitude: position.coords.longitude};
      pianos.setCurrentLocation(position.coords);
    });
  } else {
    $.post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyA98sEAJ7BWoV5sspFdkq50N-_C-MebpO4', {}, function(data) {
      pianos.setCurrentLocation({latitude: data.location.lat, longitude: data.location.lng});
    });
  }
  return new PianoView({collection: pianos});
});
