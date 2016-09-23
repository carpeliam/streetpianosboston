define(['jquery', 'underscore', 'backbone', 'text!templates/list.ejs', 'text!templates/head.ejs'], function($, _, Backbone, listTmpl, headerTmpl) {
  'use strict';
  return Backbone.View.extend({
    templates: {
      head: _.template(headerTmpl),
      list: _.template(listTmpl)
    },
    events: {
      'change .piano-cb': 'togglePiano',
      'click .toggle-sorting-help': 'toggleSortingHelp',
      'change #hide': 'showOrHidePlayedPianos'
    },
    initialize: function() {
      window.c = this.collection;
      this.showSortingMessage = window.location.protocol !== 'https:';
      this.collection.on('sort', this.render, this);
    },

    render: function() {
      var view = this;
      view.$el.html(view.templates.head({ count: view.collection.playCount(), showSortingMessage: this.showSortingMessage }));
      view.collection.each(function(piano) {
        var context = _(piano.toJSON()).extend({id: piano.cid, isPlayed: piano.isPlayed()});
        view.$el.append(view.templates.list(context));
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

      $label.toggleClass('text-muted');
      if ($cb.is(':checked')) {
        piano.play();
        if (this.$('#hide').is(':checked')) {
          $row.hide();
        }
      } else {
        piano.unplay();
      }

      var playCount = this.collection.playCount(),
          $playCount = this.$('#playCount'),
          $pianoPlural = this.$('#pianoPlural');
      $playCount.text(playCount);
      $pianoPlural.text( (playCount === 1) ? 'piano' : 'pianos');
    },

    showOrHidePlayedPianos: function() {
      var playedPianos = this.collection.select(function(p) { return p.isPlayed(); }),
          ids = _(playedPianos).map(function(p) { return '#check' + p.cid; });
      this.$(ids.join()).closest('.piano').toggle();
    }
  });
});
