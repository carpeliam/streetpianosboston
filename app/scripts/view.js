function getIconFor(piano) {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    strokeColor: piano.isPlayed() ? 'red' : 'green',
    strokeWeight: 3,
    scale: 4
  };
}

define(
  ['jquery', 'underscore', 'backbone', 'text!templates/list.ejs', 'text!templates/head.ejs', 'async!https://maps.googleapis.com/maps/api/js?key=AIzaSyA98sEAJ7BWoV5sspFdkq50N-_C-MebpO4&callback=initMap'],
  function($, _, Backbone, listTmpl, headerTmpl) {
  'use strict';
  return Backbone.View.extend({
    templates: {
      head: _.template(headerTmpl),
      list: _.template(listTmpl)
    },
    events: {
      'change .piano-cb': 'togglePiano',
      'change #hide': 'showOrHidePlayedPianos',
      'click #toggleMapView': 'toggleMapView'
    },
    initialize: function() {
      window.c = this.collection;
      this.showMap = false;
      this.collection.on('sort', this.render, this);
    },

    render: function() {
      var view = this;
      view.$el.html(view.templates.head({ count: view.collection.playCount() }));

      if (this.showMap) {
        var mapEl = $('<div>').css({height: '50vh'}).appendTo(view.$el);
        view.map = new google.maps.Map(mapEl.get(0), {
          center: {lat: 42.354358, lng: -71.063519},
          zoom: 10
        });
        view.map.markers = [];
      }

      view.collection.each(function(piano) {
        var context = _(piano.toJSON()).extend({id: piano.cid, isPlayed: piano.isPlayed()});
        if (view.showMap) {
          var infowindow = new google.maps.InfoWindow({
            content: view.templates.list(context)
          });
          var marker = new google.maps.Marker({
            position: {lat: context.position.latitude, lng: context.position.longitude},
            cid: piano.cid,
            map: view.map,
            icon: getIconFor(piano),
            title: context.title,
            info: infowindow
          });
          marker.addListener('click', function() {
            infowindow.open(view.map, marker);
          });
          view.map.markers.push(marker);
        } else {
          view.$el.append(view.templates.list(context));
        }
      });
      return view;
    },

    toggleSortingHelp: function(e) {
      e.preventDefault();
      this.$('.sorting-help').toggle();
    },

    togglePiano: function(e) {
      var $cb = $(e.target),
          $label = $cb.parent(),
          $row = $cb.closest('.piano'),
          cid = $cb.data('id'),
          piano = this.collection.get(cid);
      var marker;
      if (this.showMap) {
        marker = _(this.map.markers).detect(function(m) { return m.cid == piano.cid });
      }

      $label.toggleClass('text-muted');
      if ($cb.is(':checked')) {
        piano.play();
        if (this.$('#hide').is(':checked')) {
          if (this.showMap) {
            marker.setVisible(false);
            marker.info.close();
          } else {
            $row.hide();
          }
        }
      } else {
        piano.unplay();
      }

      if (this.showMap) {
        marker.setIcon(getIconFor(piano));
      }

      var playCount = this.collection.playCount(),
          $playCount = this.$('#playCount'),
          $pianoPlural = this.$('#pianoPlural');
      $playCount.text(playCount);
      $pianoPlural.text( (playCount === 1) ? 'piano' : 'pianos');
    },

    showOrHidePlayedPianos: function() {
      var view = this;
      var playedPianos = this.collection.select(function(p) { return p.isPlayed(); }),
          ids = _(playedPianos).map(function(p) { return '#check' + p.cid; });
      if (this.showMap) {
        _(this.map.markers).each(function(m) {
          if (_(playedPianos).any(function(p) { return p.cid === m.cid })) {
            m.setVisible(!m.getVisible());
          }
        });
      } else {
        this.$(ids.join()).closest('.piano').toggle();
      }
    },

    toggleMapView: function(e) {
        e.preventDefault();
        this.showMap = !this.showMap;
        this.render();
    }
  });
});
