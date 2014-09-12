import Ember from 'ember';
import { request as icAjaxRequest } from 'ic-ajax';
import FrontierPortfolio from 'retirement-plan/models/frontier-portfolio';
import roundTo from 'retirement-plan/utils/round-to';

export default Ember.ArrayController.extend({
  // Model: Array of portfolios from server corresponding to checkboxes
  // NB: Working with `FrontierPortfolios` not `Portfolios`

  // They come this way from the server, but just in case that changes....
  sortProperties: ['annualRisk'],
  sortAscending: true,

  needs: ['selectPortfolio', 'user/current'],
  currentUser: Ember.computed.alias('controllers.user/current'),


  //////////////////////
  // Controller State //
  //////////////////////

  loadingFrontier: false,

  displayInstructionsPanel: true,

  selectedPortfolioID: Ember.computed.alias('controllers.selectPortfolio.selectedPortfolioID'),

  selectedAssetIds: Ember.computed.alias('controllers.selectPortfolio.selectedAssetIds'),

  leftArrowDisabled: function() {
    var selectedPortfolioID, indexOfSelectedPortfolio;
    if (!this.get('hasSelectedPortfolio')) { return true; }

    selectedPortfolioID = this.get('selectedPortfolioID');
    if (Ember.isEmpty(selectedPortfolioID)) { return true; }

    indexOfSelectedPortfolio = this.get('portfolios').mapBy('id').indexOf(selectedPortfolioID);
    return indexOfSelectedPortfolio <= 0;
  }.property('hasSelectedPortfolio', 'selectedPortfolioID', 'portfolios.@each.id'),

  rightArrowDisabled: function() {
    var selectedPortfolioID, indexOfSelectedPortfolio;
    if (!this.get('hasSelectedPortfolio')) { return true; }

    selectedPortfolioID = this.get('selectedPortfolioID');
    if (Ember.isEmpty(selectedPortfolioID)) { return true; }

    indexOfSelectedPortfolio = this.get('portfolios').mapBy('id').indexOf(selectedPortfolioID);
    return indexOfSelectedPortfolio === this.get('portfolios').get('length') - 1;
  }.property('hasSelectedPortfolio', 'selectedPortfolioID', 'portfolios.@each.id'),

  ensureGraphRendered: function() {
    // This runs every time the route is accessed (including the first time).
    // Manually fire the `selectedAssetIds` observer. We don't 'get' this property
    // in the template, therefore the observer doesn't fire unless we notify,
    // or over-ride the `init` function on the controller.
    this.notifyPropertyChange('selectedAssetIds');
  },


  /////////////////////
  // Controller Data //
  /////////////////////

  portfolios: Ember.computed.alias('model'),
  allAssets:  Ember.computed.alias('controllers.selectPortfolio.model'),

  selectedAssetIdsCount: function() {
    return this.get('selectedAssetIds').length || 0;
  }.property('selectedAssetIds.@each'),

  selectedAnyAssets:    Ember.computed.gt('selectedAssetIdsCount', 0),
  selectedEnoughAssets: Ember.computed.gte('selectedAssetIdsCount', 3),

  portfoliosForDisplay: function() {
    var selectedPortfolioID = this.get('selectedPortfolioID');
    return this.get('portfolios').map(function(portfolio) {
      portfolio.set('selected', (portfolio.get('id') === selectedPortfolioID));
      return portfolio;
    });
  }.property('portfolios.@each', 'selectedPortfolioID'),

  selectedPortfolio: function() {
    var portfolioID = this.get('selectedPortfolioID');
    if (Ember.isEmpty(portfolioID)) { return null; }
    return this.get('portfolios').findBy('id', portfolioID);
  }.property('selectedPortfolioID', 'portfolios.@each'),
  hasSelectedPortfolio: Ember.computed.notEmpty('selectedPortfolio'),

  selectedPortfolioReturn: function() {
    var asDecimal = roundTo(this.get('selectedPortfolio.annualReturn') * 100, 1);
    return asDecimal + "%";
  }.property('selectedPortfolio.annualReturn'),

  selectedPortfolioRisk: function() {
    var asDecimal = roundTo(this.get('selectedPortfolio.annualRisk') * 100, 1);
    return asDecimal + "%";
  }.property('selectedPortfolio.annualRisk'),

  monthlyReturnTenThousand: Ember.computed.alias('selectedPortfolio.tenThousandMonthlyReturn'),
  monthlyVARTenThousand:    Ember.computed.alias('selectedPortfolio.tenThousandValueAtRisk'),

  allocation: function() {
    var portfolioID = this.get('selectedPortfolioID');
    if (Ember.isEmpty(portfolioID)) { return null; }
    return FrontierPortfolio.allocationFromID(portfolioID);
  }.property('selectedPortfolioID'),


  ///////////////
  // Observers //
  ///////////////

  selectedAssetIdsChanged: function() {
    // User selected different assets classes. Get the new efficient frontier (
    // which updates the graph).
    var assetIdArray = this.get('selectedAssetIds');

    // Debounce this function - it gets called multiple times on the original
    // route load, and is expensive to calculate efficient frontiers on the server
    Ember.run.debounce(this, this._updateGraph, assetIdArray, 300);
  }.observes('selectedAssetIds'),


  /////////////
  // Actions //
  /////////////

  actions: {
    hideInstructionsPanel: function() {
      this.toggleProperty('displayInstructionsPanel');
    },

    selectPortfolio: function(portfolio) {
      this.set('selectedPortfolioID', portfolio.get('id'));
    },

    selectPortfolioLeft: function() {
      var selectedPortfolioID, portfolios, portfolioIds, indexOfSelectedPortfolio,
        desiredSelectedID;

      portfolios          = this.get('portfolios');
      portfolioIds        = portfolios.mapBy('id');
      selectedPortfolioID = this.get('selectedPortfolioID');
      if (Ember.isEmpty(selectedPortfolioID)) { return null; }

      indexOfSelectedPortfolio = portfolioIds.indexOf(selectedPortfolioID);

      // Can't move left from 0, or if item not found (-1)
      if (indexOfSelectedPortfolio <= 0) { return null; }

      desiredSelectedID = portfolioIds[indexOfSelectedPortfolio - 1];
      this.set('selectedPortfolioID', desiredSelectedID);
    },

    selectPortfolioRight: function() {
      var selectedPortfolioID, portfolios, portfolioIds, indexOfSelectedPortfolio,
      desiredSelectedID;

      portfolios          = this.get('portfolios');
      portfolioIds        = portfolios.mapBy('id');
      selectedPortfolioID = this.get('selectedPortfolioID');
      if (Ember.isEmpty(selectedPortfolioID)) { return null; }

      indexOfSelectedPortfolio  = portfolioIds.indexOf(selectedPortfolioID);

      // Can't move right from last item, or if item not found (-1)
      if ( indexOfSelectedPortfolio < 0 || indexOfSelectedPortfolio === (portfolios.get('length') - 1) ) {
        return null;
      }

      desiredSelectedID = portfolioIds[indexOfSelectedPortfolio + 1];
      this.set('selectedPortfolioID', desiredSelectedID);
    },

  },


  /////////////////////////
  // 'Private' functions //
  /////////////////////////

  _updateGraph: function(assetIdArray) {
    if (Ember.isEmpty(assetIdArray) || assetIdArray.length < 1) { return null; }
    var controller = this;
    controller.set('loadingFrontier', true);
    controller._getEfficientFrontier(assetIdArray).then( function(portfolios) {
      controller.set('model', portfolios);
      controller.set('loadingFrontier', false);
    });
  },

  _getEfficientFrontier: function(assetIdArray) {
    var controller = this;

    return new Ember.RSVP.Promise(function(resolve) {
      if (assetIdArray.length > 2) { // Not allowing single or two-asset portfolios
        icAjaxRequest({
          url:  window.RetirementPlanENV.apiHost + '/efficient_frontier',
          type: 'GET',
          data: { asset_ids: assetIdArray }
        }).then( function(efficientFrontierData) {
          var prattArrowLow     = controller.get('currentUser.prattArrowLow');
          var prattArrowHigh    = controller.get('currentUser.prattArrowHigh');
          var portfolios        = [];
          var rawPortfolioData  = efficientFrontierData.efficient_frontier;
          _.forEach(rawPortfolioData, function(portfolio) {
            // Set pratt arrow on the portfolio - it will allow utility calcs
            // inside the object.
            portfolio.prattArrowLow   = prattArrowLow;
            portfolio.prattArrowHigh  = prattArrowHigh;

            // Push to main collection
            portfolios.pushObject(FrontierPortfolio.create(portfolio));
          });
          resolve(portfolios);
        });
      } else {
        resolve(Ember.A());
      }
    }); // Ember.RSVP
  },

});
