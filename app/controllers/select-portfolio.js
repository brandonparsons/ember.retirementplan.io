import Ember from 'ember';

export default Ember.ArrayController.extend({
  // Model/content: Array of all assets - used in the checkboxes

  // NB: Working with `FrontierPortfolios` not `Portfolios`

  itemController: 'selectPortfolio.listItem',

  selectedPortfolioID: null,

  selectedAssets: function() {
    return this.filterProperty('checked', true);
  }.property('@each.checked'),

  selectedAssetIds: function() {
    var assetIdArray, selectedAssets;
    selectedAssets = this.get('selectedAssets');
    if (selectedAssets && selectedAssets.length > 0) {
      assetIdArray = selectedAssets.mapBy('id');
    } else {
      assetIdArray = [];
    }
    return assetIdArray;
  }.property('selectedAssets')

});
