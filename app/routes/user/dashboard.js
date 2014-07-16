import Ember from 'ember';

export default Ember.Route.extend({

  actions: {
    actionBasedTransitionTo: function(route) {
      this.transitionTo(route);
    }
  }

});
