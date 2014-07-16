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
    if (model.get('isNew')) {
      this.transitionTo('questionnaire.new');
    }
  },

  deactivate: function() {
    this.modelFor(this.routeName).rollback();
  },

  actions: {
    updateQuestionnaire: function() {
      var route         = this;
      var questionnaire = this.modelFor(this.routeName);

      questionnaire.save().then( function() {
        RetirementPlan.setFlash('success', 'Your responses have been saved.');
        route.transitionTo('user.dashboard');
      });
    }
  }

});
