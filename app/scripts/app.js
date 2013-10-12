/*global define */
define(['backbone', 'model', 'locations', 'view'], function (Backbone, PianosCollection, locations, PianoView) {
  'use strict';
  var pianos = new PianosCollection(locations);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      // var coords = {latitude: position.coords.latitude, longitude: position.coords.longitude};
      pianos.setCurrentLocation(position.coords);
    });
  }
  var view = new PianoView({collection: pianos});
  return view;
});