/* global alertify */

var FlashQueue = Ember.ArrayProxy.create({

  content: [],

  add: function(type, message, sticky) {
    var log, messageTiming;

    if (typeof sticky !== "undefined" && sticky !== null && !!sticky) {
      if ( !isNaN(parseFloat(sticky)) && isFinite(sticky) ) {
        // Sticky is a number - we want to leave it up for a specified period of
        // time.
        messageTiming = sticky;
      } else {
        // Sticky is `true` - leave it up there
        messageTiming = 0;
      }
    } else {
      messageTiming = 3500;
    }

    if (type === 'success') {
      log = alertify.log(message, 'success', messageTiming);
    } else if (type === 'notice' || type === 'info') {
      log = alertify.log(message, '', messageTiming);
    } else {
      log = alertify.log(message, 'error', messageTiming);
    }

    if (sticky) this.pushObject(log);

    return null;
  },

  empty: function() {
    Ember.$(".alertify-log").click();
    this.set('content', []);
    return null;
  }

});

export default FlashQueue;
