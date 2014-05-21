// You can track custom events with this plugin. If you have a controller action
// that you wish to track you can use the Ember.GoogleAnalyticsTrackingMixin
// like so.

App.VideoController = Ember.Controller.extend(
  Ember.GoogleAnalyticsTrackingMixin, {
  actions: {
    play: function() {
      // ...
      //this.trackEvent('category', 'action')
      this.trackEvent('video', 'play');
      // or
      //this.trackEvent('category', 'action', 'label', value)
      this.trackEvent('video', 'play', 'youtube', 'http://youtube.com/......');
    }
  }
});
