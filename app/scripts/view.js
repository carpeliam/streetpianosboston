define(['jquery', 'underscore', 'backbone', 'text!templates/list.ejs', 'text!templates/head.html'], function($, _, Backbone, listTmpl, header) {
  'use strict';
  return Backbone.View.extend({
    template: _.template(listTmpl),
    events: {
      'change .piano-cb': 'togglePiano',
      'change #hide': 'showOrHidePlayedPianos'
    },
    initialize: function() {
      this.collection.on('sort', _(this.render).bind(this));
    },

    render: function() {
      var view = this;
      view.$el.html(header);
      view.collection.each(function(piano) {
        var context = _(piano.toJSON()).extend({id: piano.cid, isPlayed: piano.isPlayed()});
        view.$el.append(view.template(context));
      });
      return view;
    },

    togglePiano: function(e) {
      var $cb = $(e.target),
          $row = $cb.closest('.row'),
          $label = $row.find('label[for=' + $cb.attr('id') + ']'),
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
    },

    showOrHidePlayedPianos: function() {
      var playedPianos = this.collection.select(function(p) { return p.isPlayed(); }),
          ids = _(playedPianos).map(function(p) { return '#check' + p.cid; });
      this.$(ids.join()).closest('.row').toggle();
    }
  });
});