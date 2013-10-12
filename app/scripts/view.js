define(['jquery', 'underscore', 'backbone', 'text!templates/list.jst'], function($, _, Backbone, listTmpl) {
  'use strict';
  return Backbone.View.extend({
    template: _.template(listTmpl),
    events: {
      'change .piano-cb': 'togglePiano',
      'click .directions': 'comingSoon'
    },
    initialize: function() {
      this.collection.on('sort', _(this.render).bind(this));
    },

    render: function() {
      this.$el.empty();
      var view = this;
      this.collection.each(function(piano) {
        var context = _(piano.toJSON()).extend({id: piano.cid, isPlayed: piano.isPlayed()});
        view.$el.append(view.template(context));
      });
      return this;
    },

    togglePiano: function(e) {
      var $cb = $(e.target), cid = $cb.data('id'), piano = this.collection.get(cid);
      if ($cb.is(':checked')) {
        piano.play();
      } else {
        piano.unplay();
      }
    },

    comingSoon: function() {
      alert('Directions coming soon. Maybe.');
      return false;
    }
  });
});