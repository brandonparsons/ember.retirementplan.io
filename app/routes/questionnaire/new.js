import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {
    var route = this;
    var store = this.store;

    return new Ember.RSVP.Promise( function(resolve) {
      var questionnaire = route.controllerFor('user.current').get('questionnaire');
      if (questionnaire === null || typeof(questionnaire) === 'undefined' || questionnaire.get('isNew')) {
        resolve(store.createRecord('questionnaire'));
      } else {
        resolve(questionnaire);
      }
    });
  },

  afterModel: function(model) {
    if (!model.get('isNew')) {
      this.transitionTo('questionnaire.edit');
    }
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
