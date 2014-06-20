import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {
    return this.modelFor('questionnaire');
  },

  deactivate: function() {
    this.get('currentModel').rollback();
  },

  renderTemplate: function() {
    this.render({controller: 'questionnaire'});
  },

  actions: {
    updateQuestionnaire: function() {
      var route         = this;
      var questionnaire = this.get('currentModel');

      questionnaire.save().then( function() {
        RetirementPlan.setFlash('success', 'Your responses have been saved.');
        route.transitionTo('user.dashboard');
      });
    }
  }

});
