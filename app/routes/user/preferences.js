import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {
    return this.store.find('userPreference').then(function(array) {
      return array.get('firstObject');
    });
  },

  deactivate: function() {
    this.get('currentModel').rollback();
  },


  actions: {
    editPreferences: function() {
      var route = this;
      this.get('currentModel').save().then( function() {
        RetirementPlan.setFlash('success', 'Your preferences have been updated.');
        route.transitionTo('user.dashboard');
      });
    }
  }

});
