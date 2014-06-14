import Ember from 'ember';

export default Ember.ArrayController.extend({

  itemController: 'selectPortfolio.listItem',
  needs: ['selectPortfolio/chart'],

  init: function() {
    // Need to over-ride init, as we have to `get` the selectedSecurities
    // property... "Non-getted" variables do not trigger observers per Ember
    // object model docs.
    this._super(); // DO NOT REMOVE!
    this.get('selectedSecurities');
  },

  selectedSecurities: function() {
    return this.filterProperty('checked', true);
  }.property('@each.checked'),

  selectedSecuritiesChanged: function() {
    Ember.run.debounce(this, this.updateChart, 750);
  }.observes('selectedSecurities'),

  updateChart: function() {
    var tickerArray, selectedSecurities;
    selectedSecurities = this.get('selectedSecurities');
    if (selectedSecurities && selectedSecurities.length > 0) {
      tickerArray = selectedSecurities.mapBy('content').map( function(el) { return el.get('ticker'); });
    } else {
      tickerArray = [];
    }
    this.get('controllers.selectPortfolio/chart').send('updateSecurities', tickerArray);
    return true;
  }

});
