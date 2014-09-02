import Ember from 'ember';

export default Ember.ObjectController.extend({
  // Model: Current user's portfolio (c/w weights/currentShares)

  needs: ['etfs'],


  //////////////////////////
  // Computed Properties //
  /////////////////////////

  etfs:                Ember.computed.alias('controllers.etfs'),
  etfsGroupedByAsset:  Ember.computed.alias('etfs.groupedByAsset'),


  /* Display properties */

  etfGroupsForSelection: function() {
    // Filter the asset groups down to only those in the proposed portfolio
    // allocation.
    var etfs            = this.get('etfs');
    var selectedEtfs    = this.get('selectedEtfs');
    var assetIds        = Ember.keys(this.get('weights'));
    var assetGroups     = this.get('etfsGroupedByAsset');

    var relevantAssetGroups = assetGroups.filter( function(assetGroup) {
      var assetGroupTicker = assetGroup.get('asset.id');
      return assetIds.contains(assetGroupTicker);
    });

    // If they have already selected some ETFs (not first visit) then populate
    // the group with the selected value.
    return relevantAssetGroups.map( function(group) {
      var asset, assetTicker, selectedEtfTicker, selectedEtf;

      asset             = group.get('asset');
      assetTicker       = asset.get('id');
      selectedEtfTicker = selectedEtfs[assetTicker];

      if (selectedEtfTicker) {
        selectedEtf = etfs.findBy('ticker', selectedEtfTicker);
      } else {
        selectedEtf = null;
      }

      return Ember.Object.create({
        asset: asset,
        etfs: group.get('etfsInGroup'),
        selectedEtf: selectedEtf,
      });
    });
  }.property('etfs.@each', 'selectedEtfs', 'weights', 'etfsGroupedByAsset.@each'),

  etfsForHoldingsConfirmation: function() {
    // Need to confirm holdings for etfs where current shares are greater
    // than zero (i.e. part of their current portfolio), and any etfs that
    // are part of the proposed portfolio weights.

    var etfs, currentShares, selectedEtfs, selectedEtfTickers,
      currentShareTickers, relevantEtfs;

    etfs          = this.get('etfs');
    currentShares = this.get('currentShares');
    selectedEtfs  = this.get('selectedEtfsData');

    if ( Ember.isNone(currentShares) || Ember.isNone(selectedEtfs) ) { return null; }

    currentShareTickers = Ember.keys(currentShares);
    selectedEtfTickers  = Ember.keys(selectedEtfs).map( function(key) {
      return selectedEtfs[key];
    });

    relevantEtfs = etfs.filter( function(etf) {
      var etfTicker = etf.get('ticker');
      return ( currentShareTickers.contains(etfTicker) || selectedEtfTickers.contains(etfTicker) );
    });

    return relevantEtfs.map( function(etf) {
      return Ember.Object.create({
        assetClass: etf.get('asset.assetClass'),
        ticker: etf.get('ticker'),
        description: etf.get('description'),
        currentShares: currentShares[etf.get('ticker')] || 0,
      });
    });
  }.property('etfs.@each', 'currentShares', 'selectedEtfsData'),

  /* */


  /* Data properties for route */

  selectedEtfsData: function() {
    var etfGroups     = this.get('etfGroupsForSelection');
    var selectedEtfs  = {};

    etfGroups.forEach( function(group) {
      var selectedEtf = group.get('selectedEtf');
      if (!Ember.isNone(selectedEtf)) {
        selectedEtfs[group.get('asset.id')] = selectedEtf.get('ticker');
      }
    });
    return selectedEtfs;
  }.property('etfGroupsForSelection.@each.selectedEtf'),

  currentShareData: function() {
    return this.get('etfsForHoldingsConfirmation').reduce( function(memo, obj) {
      memo[obj.get('ticker')] = window.parseInt(obj.get('currentShares'));
      return memo;
    }, {});
  }.property('etfsForHoldingsConfirmation.@each.ticker', 'etfsForHoldingsConfirmation.@each.currentShares'),

  /* */


  /////////////////
  // Validations //
  /////////////////

  etfsValid: function() {
    var etfGroupsForSelection = this.get('etfGroupsForSelection');
    var selectedEtfsData      = this.get('selectedEtfsData');
    return etfGroupsForSelection.length === Ember.keys(selectedEtfsData).length;
  }.property('etfGroupsForSelection.@each', 'selectedEtfsData'),

  displayHoldingsConfirmation: Ember.computed.and('etfsValid'), // currently essentially an alias

  holdingsValid: function() {
    return this.get('etfsForHoldingsConfirmation').every( function(etf) {
      var etfShares = etf.get('currentShares');
      return !Ember.isEmpty(etfShares) && (etfShares >= 0);
    });
  }.property('etfsForHoldingsConfirmation.@each.currentShares'),

  enableSaveButton: Ember.computed.and('etfsValid', 'holdingsValid'),

});
