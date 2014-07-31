import Ember from 'ember';
import Notify from 'ember-notify';

Notify.useBootstrap();

var FlashQueue = Ember.ArrayProxy.create({

  content: [],

  add: function(type, message, sticky) {
    var notification, messageTiming;

    if (typeof sticky !== "undefined" && sticky !== null && !!sticky) {
      if ( !isNaN(parseFloat(sticky)) && isFinite(sticky) ) {
        // Sticky is a number - we want to leave it up for a specified period of time.
        messageTiming = sticky;
      } else {
        // Sticky is `true` - leave it up there
        messageTiming = null;
      }
    } else {
      messageTiming = 3500;
    }

    if (type === 'success') {
      notification = Notify.success(message, {closeAfter: messageTiming});
    } else if (type === 'notice' || type === 'info') {
      notification = Notify.info(message, {closeAfter: messageTiming});
    } else {
      notification = Notify.warning(message, {closeAfter: messageTiming});
    }

    if (sticky) {
      this.pushObject(notification);
    }

    return null;
  },

  empty: function() {
    var stickyMessages = this.get('content');
    stickyMessages.forEach(function(notification) {
      notification.send('close');
    });
    this.set('stickyMessages', []);
    return null;
  }

});

export default FlashQueue;
