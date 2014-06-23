import DS from 'ember-data';

export default DS.Model.extend({

  ////////////////
  // Properties //
  ////////////////

  email:                        DS.attr('string'),
  name:                         DS.attr('string'),
  image:                        DS.attr('string'),
  prattArrowLow:                DS.attr('number'),
  prattArrowHigh:               DS.attr('number'),
  hasPassword:                  DS.attr('boolean'),
  confirmed:                    DS.attr('boolean'),
  acceptedTerms:                DS.attr('boolean'),
  hasCompletedQuestionnaire:    DS.attr('boolean'),
  hasSelectedPortfolio:         DS.attr('boolean'),
  hasSelectedExpenses:          DS.attr('boolean'),
  hasSimulationInput:           DS.attr('boolean'),
  hasCompletedSimulation:       DS.attr('boolean'),
  hasTrackedPortfolio:          DS.attr('boolean'),


  ///////////////////
  // Associations //
  //////////////////

  authentications:  DS.hasMany('authentication', {async: true}),
  questionnaire:    DS.belongsTo('questionnaire', {async: true}),
  simulationInput:  DS.belongsTo('simulationInput', {async: true}),


  /////////////////////////
  // Computed Properties //
  /////////////////////////

  authenticationCount: function() {
    return this.get('authentications.length');
  }.property('authentications.@each')

});
