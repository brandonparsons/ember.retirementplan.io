import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {
    return this.store.find('userPreference').then(function(array) {
      return array.get('firstObject');
    });
  },

  deactivate: function() {
    this.modelFor(this.routeName).rollback();
  },


  actions: {

    editPreferences: function() {
      var route = this;
      var preferences = this.modelFor(this.routeName);
      preferences.save().then( function() {
        RetirementPlan.setFlash('success', 'Your preferences have been updated.');
        route.transitionTo('user.dashboard');
      });
    },

    transitionToProfile: function() {
      this.transitionTo('user.profile');
    }

  }

});
