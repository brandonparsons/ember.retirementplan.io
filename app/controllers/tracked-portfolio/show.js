import Ember from 'ember';
import roundTo from 'retirement-plan/utils/round-to';

export default Ember.ObjectController.extend({
  // Model: { portfolio: {...}, prices: {....} }

  needs: ['etfs'],

  targetAllocationInformation: function() {
    var prices          = this.get('prices');
    var currentShares   = this.get('portfolio.currentShares');
    var weights         = this.get('portfolio.weights');
    var selectedEtfs    = this.get('portfolio.selectedEtfs');
    var etfs            = this.get('controllers.etfs');

    var currentMarketValue = Ember.keys(prices).reduce( function(result, etfTicker) {
      var numberOfShares = currentShares[etfTicker] || 0.0;
      var priceOfEtf = prices[etfTicker];
      result += numberOfShares * priceOfEtf;
      return result;
    }, 0);

    return Ember.keys(weights).map( function(assetId) {
      var representativeEtfTicker, representativeEtf, targetWeight, currentWeight;

      representativeEtfTicker = selectedEtfs[assetId];
      representativeEtf       = etfs.findBy('ticker', representativeEtfTicker);

      targetWeight = weights[assetId];

      if (Ember.keys(currentShares).contains(representativeEtfTicker)) {
        currentWeight = (currentShares[representativeEtfTicker] * prices[representativeEtfTicker]) / currentMarketValue;
      } else {
        currentWeight = 0;
      }

      return Ember.Object.create({
        assetClass:     representativeEtf.get('asset.assetClass'),
        targetWeight:   '' + roundTo(targetWeight*100, 1) + '%',
        currentWeight:  '' + roundTo(currentWeight*100, 1) + '%',
      });
    });
  }.property('prices', 'portfolio.currentShares', 'portfolio.weights', 'portfolio.selectedEtfs', 'controllers.etfs'),

  currentHoldingsInformation: function() {
    var currentShares = this.get('portfolio.currentShares');
    var etfs          = this.get('controllers.etfs');

    return Ember.keys(currentShares).map( function(etfTicker) {
      var etf = etfs.findBy('ticker', etfTicker);

      return Ember.Object.create({
        assetClass:     etf.get('asset.assetClass'),
        description:    etf.get('description'),
        ticker:         etf.get('ticker'),
        currentShares:  currentShares[etfTicker],
      });
    });
  }.property('portfolio.currentShares', 'controllers.efs'),

  portfolioInBalance: function() {
    var allowableDrift = this.get('allowableDrift');

    var displayPercentageToFloat = function(displayPercentage) {
      return window.parseFloat(displayPercentage.replace(/%/, ''));
    };

    return this.get('targetAllocationInformation').every(function(allocInfo) {
      var targetWeight  = displayPercentageToFloat(allocInfo.get('targetWeight'));
      var currentWeight = displayPercentageToFloat(allocInfo.get('currentWeight'));
      var inBalance     = Math.abs(targetWeight - currentWeight) < allowableDrift;
      return inBalance;
    });
  }.property('allowableDrift', 'targetAllocationInformation'),

});
