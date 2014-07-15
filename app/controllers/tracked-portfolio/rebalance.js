import Ember from 'ember';
import roundTo from 'retirement-plan/utils/round-to';

export default Ember.ObjectController.extend({
  // Model: { portfolio: {...}, prices: {....} }

  needs: ['etfs'],


  ////////////////
  // Properties //
  ////////////////

  amount: null,


  //////////////////////////
  // Computed Properties //
  /////////////////////////

  etfs: Ember.computed.alias('controllers.etfs'),

  rebalanceInformation: function() {

    /* Load up required data */

    var prices = this.get('prices');
    var etfs = this.get('etfs');
    var targetAssetWeights = this.get('portfolio.weights');

    // selectedEtfs is normally { assetId => etfTicker }
    // Invert and grab keys to get list of selected etf tickers
    var selectedEtfs = Ember.keys(_.invert(this.get('portfolio.selectedEtfs')));

    var currentShares = this.get('portfolio.currentShares');

    var amount = window.parseFloat(this.get('amount'));

    var currentMarketValue = Ember.keys(prices).reduce( function(result, etfTicker) {
      var numberOfShares = currentShares[etfTicker];
      var priceOfEtf = prices[etfTicker];
      result += numberOfShares * priceOfEtf;
      return result;
    }, 0);

    var finalPortfolioValue = currentMarketValue + amount;

    /* */


    /* Build rebalance information */

    // Prices keys contain all ETFs (ones with current shares, and all in
    // desired allocation).
    var rebalanceInfo = Ember.keys(prices).reduce( function(result, etfTicker) {
      var etf, asset, sharesOfEtf, priceOfEtf, isSelected,
        targetAssetWeight, requiredEndDollars, dollarsShort, sharesToBuy;

      etf    = etfs.findBy('ticker', etfTicker);
      asset  = etf.get('asset');

      sharesOfEtf = currentShares[etfTicker];
      priceOfEtf  = prices[etfTicker];
      isSelected  = selectedEtfs.contains(etfTicker);

      if (isSelected) {
        targetAssetWeight = targetAssetWeights[asset.get('id')];
      } else {
        targetAssetWeight = 0.0;
      }

      requiredEndDollars  = targetAssetWeight * finalPortfolioValue;
      dollarsShort        = requiredEndDollars - (sharesOfEtf * priceOfEtf);
      sharesToBuy         = roundTo( (dollarsShort / priceOfEtf), 0);

      result.pushObject(Ember.Object.create({
        assetClass:     asset.get('assetClass'),
        description:    etf.get('description'),
        ticker:         etf.get('ticker'),
        currentShares:  sharesOfEtf,
        sharesToBuy:    sharesToBuy, // key name depended on in purchasedUnits function
        expectedCost:   sharesToBuy * priceOfEtf,
      }));

      return result;
    }, []);

    /* */

    return rebalanceInfo;
  }.property('amount', 'prices', 'etfs', 'portfolio', 'portfolio.weights',
    'portfolio.selectedEtfs', 'portfolio.currentShares'),

  emailInformation: function() {
    return this.get('rebalanceInformation').reduce( function(result, rebalanceRow) {
      var ticker  = rebalanceRow.get('ticker');
      result[ticker] = {
        "asset_class":     rebalanceRow.get('assetClass'),
        "description":    rebalanceRow.get('description'),
        "current_shares":  window.parseFloat(rebalanceRow.get('currentShares')),
        "shares_to_buy":    window.parseFloat(rebalanceRow.get('sharesToBuy')),
      };
      return result;
    }, {} );
  }.property('rebalanceInformation.@each.sharesToBuy'),

  purchasedUnits: function() {
    return this.get('rebalanceInformation').reduce( function(result, rebalanceRow) {
      var ticker  = rebalanceRow.get('ticker');
      var noUnits = window.parseFloat(rebalanceRow.get('sharesToBuy'));
      result[ticker] = noUnits;
      return result;
    }, {} );
  }.property('rebalanceInformation.@each.sharesToBuy'),


  /////////////////
  // Validations //
  /////////////////

  amountValid:      Ember.computed.and('amountPresent', 'amountValueValid'),
  amountPresent:    Ember.computed.notEmpty('amount'),
  amountValueValid: Ember.computed.gte('amount', 0),

  enableSaveButton: Ember.computed.and('amountValid'),

});
