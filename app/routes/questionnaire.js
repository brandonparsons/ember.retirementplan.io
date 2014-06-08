export default Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {

  model: function() {
    var store = this.store;

    return new Ember.RSVP.Promise(function(resolve) {
      store.find('questionnaire').then(function(array) {
        if (array.get('length') > 0) {
          resolve(array.get('firstObject'));
        } else {
          resolve(store.createRecord('questionnaire'));
        }
      });
    });
  },

  actions: {
    cancel: function() {
      this.transitionTo('user.dashboard');
    }
  }

});
