import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {
    return this.modelFor('questionnaire');
  },

  actions: {
    createQuestionnaire: function() {
      var route         = this;
      var questionnaire = this.modelFor(this.routeName);

      questionnaire.save().then( function() {
        // This is their first time submitting (in the `new` route). Update the
        // user model prior to transitioning so the dashboard representation
        // is correct.
        route.controllerFor('user.current').get('model').reload().then(function() {
          route.transitionTo('user.dashboard');
          RetirementPlan.setFlash('success', 'Your responses have been saved. Next up - select a portfolio!');
        });
      });
    }
  }

});
