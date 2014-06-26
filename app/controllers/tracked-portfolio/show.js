import Ember from 'ember';
import roundTo from 'retirement-plan/utils/round-to';

export default Ember.ObjectController.extend({
  // Model: { portfolio: {...}, prices: {....} }

  needs: ['etfs'],

  targetAllocationInformation: function() {
    var prices                = this.get('prices');
    var currentShares         = this.get('portfolio.currentShares');
    var weights               = this.get('portfolio.weights');
    var selectedEtfs          = this.get('portfolio.selectedEtfs');
    var etfs                  = this.get('controllers.etfs');

    var currentMarketValue = Ember.keys(prices).reduce( function(result, etfTicker) {
      var numberOfShares = currentShares[etfTicker];
      var priceOfEtf = prices[etfTicker];
      result += numberOfShares * priceOfEtf;
      return result;
    }, 0);

    return Ember.keys(weights).map( function(securityTicker) {
      var representativeEtfTicker = selectedEtfs[securityTicker];
      var representativeEtf       = etfs.findBy('ticker', representativeEtfTicker);

      var targetWeight  = weights[securityTicker];
      var currentWeight = (currentShares[representativeEtfTicker] * prices[representativeEtfTicker]) / currentMarketValue;

      return Ember.Object.create({
        assetClass:     representativeEtf.get('security.assetClass'),
        targetWeight:   '' + roundTo(targetWeight*100, 1) + '%',
        currentWeight:  '' + roundTo(currentWeight*100, 1) + '%',
      });
    });
  }.property('prices', 'portfolio.currentShares', 'portfolio.weights', 'portfolio.selectedEtfs', 'etfs'),

  currentHoldingsInformation: function() {
    var currentShares = this.get('portfolio.currentShares');
    var etfs          = this.get('controllers.etfs');


    return Ember.keys(currentShares).map( function(etfTicker) {
      var etf = etfs.findBy('ticker', etfTicker);

      return Ember.Object.create({
        assetClass: etf.get('security.assetClass'),
        description: etf.get('description'),
        ticker: etf.get('ticker'),
        currentShares: currentShares[etfTicker],
      });
    });
  }.property('portfolio.currentShares', 'efs'),

});
