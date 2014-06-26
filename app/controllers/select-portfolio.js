import Ember from 'ember';

export default Ember.ArrayController.extend({
  // Model/content: Array of all securities - used in the checkboxes

  // NB: Working with `FrontierPortfolios` not `Portfolios`

  itemController: 'selectPortfolio.listItem',

  selectedPortfolioID: null,

  selectedSecurities: function() {
    return this.filterProperty('checked', true);
  }.property('@each.checked'),

  selectedTickers: function() {
    var tickerArray, selectedSecurities;
    selectedSecurities = this.get('selectedSecurities');
    if (selectedSecurities && selectedSecurities.length > 0) {
      tickerArray = selectedSecurities.mapBy('ticker');
    } else {
      tickerArray = [];
    }
    return tickerArray;
  }.property('selectedSecurities')

});
