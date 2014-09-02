import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'table',
  classNames: ['table', 'table-striped', 'table-bordered', 'table-hover', 'table-responsive', 'text-center'],


  /////////////////////////
  // COMPUTED PROPERTIES //
  /////////////////////////

  optimalRiskUtilityLow: function() {
    return _.max(this.get('portfolios'), function(portfolio) {
      return portfolio.get('utilityLow');
    }).get('annualRisk');
  }.property('portfolios.@each.utilityLow', 'portfolios.@each.annualRisk'),

  optimalRiskUtilityHigh: function() {
    return _.max(this.get('portfolios'), function(portfolio) {
      return portfolio.get('utilityHigh');
    }).get('annualRisk');
  }.property('portfolios.@each.utilityHigh', 'portfolios.@each.annualRisk'),

  portfoliosWithAdditionalData: function() {
    var component = this;

    return component.get('portfolios').map(function(portfolio, index) {
      var portfolioRisk   = portfolio.get('annualRisk');
      var optimalRiskLow  = component.get('optimalRiskUtilityLow');
      var optimalRiskHigh = component.get('optimalRiskUtilityHigh');

      // Set the cell colours depending on the risk of the portfolios.
      if (portfolioRisk < optimalRiskLow) {
        portfolio.set('rowClass', 'warning');
      } else if (portfolioRisk > optimalRiskHigh) {
        portfolio.set('rowClass', 'danger');
      } else {
        portfolio.set('rowClass', 'suggested-risk');
      }

      // Set an index on each portfolio for display
      portfolio.set('prettyIndex', index + 1);

      return portfolio;
    });
  }.property('portfolios.@each.annualRisk', 'optimalRiskUtilityLow', 'optimalRiskUtilityHigh'),


  /////////////
  // ACTIONS //
  /////////////

  actions: {
    selectPortfolio: function(portfolio) {
      this.sendAction('selectPortfolio', portfolio);
    }
  }
});
