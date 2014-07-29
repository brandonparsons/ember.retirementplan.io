/* global FastClick, Headroom, $ */

import Ember from 'ember';

export default Ember.View.extend({

  didInsertElement: function() {
    var header, headroom;

    FastClick.attach(document.body);

    $('.dropdown-toggle').click(function() {
      var location;
      location = $(this).attr('href');
      if (location != null) {
        window.location.href = location;
        return false;
      } else {
        return true;
      }
    });

    header = $('.navbar')[0];
    headroom = new Headroom(header);
    headroom.init();
    $('body').tooltip({
      selector: '[data-toggle=tooltip]',
      html: true
    });

    $('body').popover({
      selector: '[data-toggle=popover]',
      html: true
    });
  }
});
