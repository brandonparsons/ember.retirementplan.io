import Ember from 'ember';

export default Ember.Controller.extend({

  ////////////////////////////////////
  // Properties for user's progress //
  ////////////////////////////////////

  questionnaireComplete:      Ember.computed.alias('currentUser.hasCompletedQuestionnaire'),
  portfolioSelectionComplete: Ember.computed.alias('currentUser.hasSelectedPortfolio'),
  simulationComplete:         Ember.computed.alias('currentUser.hasCompletedSimulation'),
  trackedPortfolioComplete:   Ember.computed.alias('currentUser.hasTrackedPortfolio'),

  userIsComplete: Ember.computed.alias('trackedPortfolioComplete'),

  onStep: function() {
    if (this.get('trackedPortfolioComplete')) {
      return "FINISHED";
    } else if (this.get('simulationComplete')) {
      return "TRACKED_PORTFOLIO";
    } else if (this.get('portfolioSelectionComplete')) {
      return "SIMULATION";
    } else if (this.get('questionnaireComplete')) {
      return "PORTFOLIO_SELECTION";
    } else {
      return "QUESTIONNAIRE";
    }
  }.property('questionnaireComplete', 'portfolioSelectionComplete', 'simulationComplete', 'trackedPortfolioComplete'),
  nextStepText: function(){
    var onStep = this.get('onStep');
    if (onStep === 'QUESTIONNAIRE') {
      return "Risk Questionnaire";
    } else if (onStep === 'PORTFOLIO_SELECTION') {
      return "Portfolio Selection";
    } else if (onStep === 'SIMULATION') {
      return "Retirement Simulation";
    } else if (onStep === 'TRACKED_PORTFOLIO') {
      return "Portfolio Setup";
    } else {
      return "Relax!"; // Shouldn't get here user would be `userIsComplete`
    }
  }.property('onStep'),
  nextStepLinkRoute: function() {
    var onStep = this.get('onStep');
    if (onStep === 'QUESTIONNAIRE') {
      return 'questionnaire';
    } else if (onStep === 'PORTFOLIO_SELECTION') {
      return 'select_portfolio';
    } else if (onStep === 'SIMULATION') {
      return 'retirement_simulation';
    } else if (onStep === 'TRACKED_PORTFOLIO') {
      return 'track_portfolio';
    } else {
      return 'dashboard'; // Shouldn't get here user would be `userIsComplete`
    }
  }.property('onStep'),


  questionnaireActive:  Ember.computed.equal('onStep', 'QUESTIONNAIRE'),
  questionnaireEnabled: true,

  portfolioSelectionActive:   Ember.computed.equal('onStep', 'PORTFOLIO_SELECTION'),
  portfolioSelectionEnabled:  Ember.computed.and('questionnaireComplete'),

  retirementSimulationActive:   Ember.computed.equal('onStep', 'SIMULATION'),
  retirementSimulationEnabled:  Ember.computed.and('questionnaireComplete', 'portfolioSelectionComplete'),

  trackPortfolioActive:   Ember.computed.equal('onStep', 'TRACKED_PORTFOLIO'),
  trackPortfolioEnabled:  Ember.computed.and('questionnaireComplete', 'portfolioSelectionComplete', 'simulationComplete'),

});
