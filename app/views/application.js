/* global FastClick, Headroom, $ */

import Ember from 'ember';

export default Ember.View.extend({

  didInsertElement: function() {

    // HeadRoom.js
    var header = $('.navbar')[0];
    var headroom = new Headroom(header);
    headroom.init();
    $('body').tooltip({
      selector: '[data-toggle=tooltip]',
      html: true
    });

    // FastClick.js
    // Removing for now, see if it helps graphs work on mobile....
    // FastClick.attach(document.body);

    // Navbar hover fix
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

    // Bootstrap.js popovers
    $('body').popover({
      selector: '[data-toggle=popover]',
      html: true
    });
  }
});
