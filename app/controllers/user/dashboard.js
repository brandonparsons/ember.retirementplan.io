import Ember from 'ember';

export default Ember.ObjectController.extend({

  questionnaireActive: Ember.computed.not('currentUser.completedQuestionnaire'),
  portfolioSelectionActive: false,
  retirementSimulationActive: true,
  trackPortfolioActive: false

});
