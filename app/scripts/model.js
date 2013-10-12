define(['backbone', 'haversine'], function(Backbone, distance) {
  'use strict';
  
  function getStore() {
    return JSON.parse(localStorage.getItem('finishedPianos') || '{}');
  }
  function saveStore(store) {
    localStorage.setItem('finishedPianos', JSON.stringify(store));
  }
  var Piano = Backbone.Model.extend({
    isPlayed: function() {
      var store = getStore();
      return !!store[this.get('title')];
    },

    play: function() {
      var store = getStore();
      store[this.get('title')] = this.toJSON();
      saveStore(store);
    },

    unplay: function() {
      var store = getStore();
      delete store[this.get('title')];
      saveStore(store);
    }
  });
  return Backbone.Collection.extend({
    model: Piano,
    setCurrentLocation: function(location) {
      this.currentLocation = location;
      this.sort();
    },
    comparator: function(loc1, loc2) {
      if (typeof this.currentLocation === 'undefined') {
        return 0;
      }
      return distance(loc1.get('position'), this.currentLocation) - distance(loc2.get('position'), this.currentLocation);
    }
  });
});