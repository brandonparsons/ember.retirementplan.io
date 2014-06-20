import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {
    return this.modelFor('questionnaire');
  },

  renderTemplate: function() {
    this.render({controller: 'questionnaire'});
  },

  actions: {
    createQuestionnaire: function() {
      var route         = this;
      var questionnaire = this.get('currentModel');

      questionnaire.save().then( function() {
        RetirementPlan.setFlash('success', 'Your responses have been saved.');
        route.transitionTo('user.dashboard');
      });
    }
  }

});
