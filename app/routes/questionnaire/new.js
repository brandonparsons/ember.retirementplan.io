import errorProcessor from 'retirement-plan/utils/error-processor';


export default Ember.Route.extend({

  model: function() {
    return this.modelFor('questionnaire');
  },

  afterModel: function(model) {
    if (!model.get('isNew')) this.transitionTo('questionnaire.edit');
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
      }, function(errorResponse) {
        var errorMessage = errorProcessor(errorResponse) || "Sorry - something went wrong.  Please try again.";
        RetirementPlan.setFlash('error', errorMessage);
      });
    }
  }

});
