/* global FastClick, Headroom, $ */

import Ember from 'ember';
import mobileCheck from 'retirement-plan/utils/mobile-check';

export default Ember.View.extend({

  didInsertElement: function() {
    var popoverTrigger;

    // HeadRoom.js
    var header = $('.navbar')[0];
    var headroom = new Headroom(header);
    headroom.init();
    $('body').tooltip({
      selector: '[data-toggle=tooltip]',
      html: true
    });

    // FastClick.js
    FastClick.attach(document.body);

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
    if (mobileCheck()) { // Mobile browser
      popoverTrigger = 'click';
    } else {
      popoverTrigger = 'hover';
    }
    $('body').popover({
      selector: '[data-toggle=popover]',
      html: true,
      trigger: popoverTrigger
    });
  }
});
