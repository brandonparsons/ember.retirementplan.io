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
  }.property('trackedPortfolioComplete', 'simulationComplete', 'portfolioSelectionComplete', 'questionnaireComplete'),

  // These only to be used if you are specifically on the simulation step
  hasConfirmedExpenses:       Ember.computed.alias('currentUser.hasSelectedExpenses'),
  hasNotConfirmedExpenses:    Ember.computed.not('hasConfirmedExpenses'),
  hasInputParameters:         Ember.computed.alias('currentUser.hasSimulationInput'),
  hasNotInputParameters:      Ember.computed.not('hasInputParameters'),
  hasNotCompletedSimulation:  Ember.computed.not('simulationComplete'),
  onParametersStep:           Ember.computed.and('hasConfirmedExpenses', 'hasNotInputParameters'),
  onSimulateStep:             Ember.computed.and('hasInputParameters', 'hasNotCompletedSimulation'),
  nextSimulateStepRoute: function() {
    if ( this.get('hasNotConfirmedExpenses') ) {
      return 'retirement_simulation.expenses';
    } else if ( this.get('onParametersStep') ) {
      return 'retirement_simulation.parameters';
    } else if ( this.get('onSimulateStep') ) {
      return 'retirement_simulation.simulate';
    } else {
      // If they have finished the simulation, makes most sense to link them
      // back to the simulate page, in case they want to run more simulations.
      return 'retirement_simulation.simulate';
    }
  }.property('hasNotConfirmedExpenses', 'onParametersStep', 'onSimulateStep'),


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
      return this.get('nextSimulateStepRoute');
    } else if (onStep === 'TRACKED_PORTFOLIO') {
      return 'track_portfolio';
    } else {
      return 'user.dashboard'; // Shouldn't get here user would be `userIsComplete`
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


  /////////////
  // Actions //
  /////////////

  actions: {

    actionBasedTransitionTo: function(route) {
      // There is an action in application route that will handle this, but we
      // need to check if it should be enabled at this point (user progress)
      if (route === 'questionnaire') {
        return this.get('questionnaireEnabled');
      } else if (route === 'select_portfolio') {
        return this.get('portfolioSelectionEnabled');
      } else if ( route.match(/retirement_simulation\..*/i) ) {
        return this.get('retirementSimulationEnabled');
      } else if (route === 'track_portfolio') {
        return this.get('trackPortfolioEnabled');
      } else {
        return false; // Shouldn't get here unless you add additional buttons
      }
    }

  }

});
