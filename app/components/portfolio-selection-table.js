import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'table',
  classNames: ['table', 'table-striped', 'table-bordered', 'table-hover', 'table-responsive', 'text-center'],

  optimalRiskUtilityLow: function() {
    return _.max(this.get('portfolios'), function(portfolio) {
      return portfolio.get('utilityLow');
    }).get('annualRisk');
  }.property('portfolios.@each.annualRisk'),

  optimalRiskUtilityHigh: function() {
    return _.max(this.get('portfolios'), function(portfolio) {
      return portfolio.get('utilityHigh');
    }).get('annualRisk');
  }.property('portfolios.@each.annualRisk'),

  portfoliosWithAdditionalData: function() {
    var component = this;

    return component.get('portfolios').map(function(portfolio, index) {
      var portfolioRisk;

      // Set the cell colours depending on the risk of the portfolios.
      portfolioRisk = portfolio.get('annualRisk');
      if (portfolioRisk < component.get('optimalRiskUtilityLow')) {
        portfolio.set('rowClass', 'warning');
      } else if (portfolioRisk > component.get('optimalRiskUtilityHigh')) {
        portfolio.set('rowClass', 'danger');
      } else {
        portfolio.set('rowClass', 'suggested-risk');
      }

      // Set an index on each portfolio for display
      portfolio.set('prettyIndex', index + 1);

      return portfolio;
    });
  }.property('portfolios.@each', 'optimalRiskUtilityLow', 'optimalRiskUtilityHigh'),

  actions: {
    selectPortfolio: function(portfolio) {
      this.sendAction('selectPortfolio', portfolio);
    }
  }
});
