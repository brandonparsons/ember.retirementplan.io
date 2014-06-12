import DS from 'ember-data';

export default DS.Model.extend({
  age:                        DS.attr('number'),
  sex:                        DS.attr('number'),
  noPeople:                   DS.attr('number'),
  realEstateVal:              DS.attr('number'),
  savingReason:               DS.attr('number'),
  investmentTimeline:         DS.attr('number'),
  investmentTimelineLength:   DS.attr('number'),
  economyPerformance:         DS.attr('number'),
  financialRisk:              DS.attr('number'),
  creditCard:                 DS.attr('number'),
  pension:                    DS.attr('number'),
  inheritance:                DS.attr('number'),
  bequeath:                   DS.attr('number'),
  degree:                     DS.attr('number'),
  loan:                       DS.attr('number'),
  forseeableExpenses:         DS.attr('number'),
  married:                    DS.attr('number'),
  emergencyFund:              DS.attr('number'),
  jobTitle:                   DS.attr('number'),
  investmentExperience:       DS.attr('number')
});
