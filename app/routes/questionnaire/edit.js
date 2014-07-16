import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {
    return this.modelFor('questionnaire');
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
