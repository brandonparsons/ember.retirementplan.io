import Ember from 'ember';
import { request as icAjaxRequest } from 'ic-ajax';
import FrontierPortfolio from 'retirement-plan/models/frontier-portfolio';
import roundTo from 'retirement-plan/utils/round-to';

export default Ember.ArrayController.extend({
  // Model/content: Array of portfolios from server corresponding to checkboxes

  // NB: Working with `FrontierPortfolios` not `Portfolios`

  // They come this way from the server, but just in case that changes....
  sortProperties: ['annualRisk'],
  sortAscending: true,

  needs: ['selectPortfolio'],


  //////////////////////
  // Controller State //
  //////////////////////

  loadingFrontier: false,

  selectedPortfolioID: Ember.computed.alias('controllers.selectPortfolio.selectedPortfolioID'),

  hasSelectedPortfolio: Ember.computed.notEmpty('selectedPortfolioID'),

  selectedAssetIds: Ember.computed.alias('controllers.selectPortfolio.selectedAssetIds'),

  ensureGraphRendered: function() {
    // This runs every time the route is accessed (including the first time).
    // Manually fire the `selectedAssetIds` observer. We don't "get" this property
    // in the template, therefore the observer doesn't fire unless we notify,
    // or over-ride the `init` function on the controller.
    this.notifyPropertyChange('selectedAssetIds');
  },

  leftArrowDisabled: function() {
    var indexOfSelectedPortfolio = this.mapBy('id').indexOf(this.get('selectedPortfolioID'));
    return indexOfSelectedPortfolio <= 0;
  }.property('selectedPortfolioID'),

  rightArrowDisabled: function() {
    var indexOfSelectedPortfolio = this.mapBy('id').indexOf(this.get('selectedPortfolioID'));
    return indexOfSelectedPortfolio === this.get('length') - 1;
  }.property('selectedPortfolioID'),


  /////////////////////
  // Controller Data //
  /////////////////////

  portfolios: Ember.computed.alias('content'),

  allAssets: Ember.computed.alias('controllers.selectPortfolio.content'),

  selectedAssetIdsCount: function() {
    return this.get('selectedAssetIds').length || 0;
  }.property('selectedAssetIds.@each'),

  selectedAnyAssets: Ember.computed.gt('selectedAssetIdsCount', 0),
  selectedEnoughAssets: Ember.computed.gte('selectedAssetIdsCount', 3),

  selectedPortfolio: function() {
    var portfolioID = this.get('selectedPortfolioID');
    if (!portfolioID) { return null; }
    return this.get('portfolios').findBy('id', portfolioID);
  }.property('selectedPortfolioID', 'portfolios'),

  selectedPortfolioReturn: function() {
    var asDecimal = roundTo(this.get('selectedPortfolio.annualReturn') * 100, 1);
    return asDecimal + "%";
  }.property('selectedPortfolio.annualReturn'),

  selectedPortfolioRisk: function() {
    var asDecimal = roundTo(this.get('selectedPortfolio.annualRisk') * 100, 1);
    return asDecimal + "%";
  }.property('selectedPortfolio.annualRisk'),

  monthlyReturnTenThousand: function() {
    return this.get('selectedPortfolio.tenThousandMonthlyReturn');
  }.property('selectedPortfolio'),

  monthlyVARTenThousand: function() {
    return this.get('selectedPortfolio.tenThousandValueAtRisk');
  }.property('selectedPortfolio'),

  allocation: function() {
    var portfolioID = this.get('selectedPortfolioID');
    if (!portfolioID) { return null; }
    return FrontierPortfolio.allocationFromID(portfolioID);
  }.property('selectedPortfolioID'),

  ///// Chart Data /////
  scatterChartData: function() {
    // If there are portfolios in the controller's content, extract the data
    // that the chart needs.
    var portfolios = this.get('portfolios');
    if (portfolios.length === 0) { return null; }
    return this._extractChartDataFromPortfolios(portfolios);
  }.property('portfolios.@each'),

  pieChartData: function() {
    var allocation  = this.get('allocation');
    var allAssets   = this.get('allAssets');
    return _.transform(allocation, function(memo, percentageAllocation, id) {
      var percentageFormatted = percentageAllocation * 100;
      var description = allAssets.findBy('id', id).get('assetClass');
      memo.push({ "label": description, "value": percentageFormatted });
      return true;
    }, []);
  }.property('allocation'),
  ///////////////////////


  ///////////////
  // Observers //
  ///////////////

  selectedAssetIdsChanged: function() {
    // User selected different assets classes. Get the new efficient frontier (
    // which updates the graph).
    var assetIdArray = this.get('selectedAssetIds');

    // Debounce this function - it gets called multiple times on the original
    // route load, and is expensive to calculate efficient frontiers on the server
    Ember.run.debounce(this, this._updateGraph, assetIdArray, 100);
  }.observes('selectedAssetIds'),


  /////////////
  // Actions //
  /////////////

  actions: {

    selectPortfolioLeft: function() {
      var selectedPortfolioID, indexOfSelectedPortfolio, desiredSelectedID;

      selectedPortfolioID       = this.get('selectedPortfolioID');
      if (!selectedPortfolioID) { return null; }

      indexOfSelectedPortfolio = this.mapBy('id').indexOf(selectedPortfolioID);

      // Can't move left from 0, or if item not found (-1)
      if (indexOfSelectedPortfolio <= 0) { return null; }

      desiredSelectedID = this.mapBy('id')[indexOfSelectedPortfolio - 1];
      this.set('selectedPortfolioID', desiredSelectedID);
    },

    selectPortfolioRight: function() {
      var selectedPortfolioID, indexOfSelectedPortfolio, desiredSelectedID;

      selectedPortfolioID       = this.get('selectedPortfolioID');
      if (!selectedPortfolioID) { return null; }

      indexOfSelectedPortfolio  = this.mapBy('id').indexOf(selectedPortfolioID);

      // Can't move right from last item, or if item not found (-1)
      if ( indexOfSelectedPortfolio < 0 || indexOfSelectedPortfolio === (this.get('length') - 1) ) {
        return null;
      }

      desiredSelectedID = this.mapBy('id')[indexOfSelectedPortfolio + 1];
      this.set('selectedPortfolioID', desiredSelectedID);
    }

  },


  /////////////////////////
  // 'Private' functions //
  /////////////////////////

  _updateGraph: function(assetIdArray) {
    if (!assetIdArray || assetIdArray.length < 1) { return null; }
    var controller = this;
    controller.set('loadingFrontier', true);
    controller._getEfficientFrontier(assetIdArray).then( function(portfolios) {
      controller.set('content', portfolios);
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
        }); // icAjaxRequest
      } else {
        resolve(Ember.A());
      }
    }); // Ember.RSVP
  },

  _extractChartDataFromPortfolios: function(portfolios) {
    var optimalRiskUtilityLow = _.max(portfolios, function(portfolio) {
      return portfolio.get('utilityLow');
    }).get('annualRisk');

    var optimalRiskUtilityHigh = _.max(portfolios, function(portfolio) {
      return portfolio.get('utilityHigh');
    }).get('annualRisk');

    return portfolios.map( function(portfolio) {
      var thisPortfoliosRisk, riskBucket;

      thisPortfoliosRisk = portfolio.get('annualRisk');
      // Groups colours based on order - low / suggested / high
      if (thisPortfoliosRisk < optimalRiskUtilityLow) {
        riskBucket = "Low Risk Level";
      } else if (thisPortfoliosRisk > optimalRiskUtilityHigh) {
        riskBucket = "High Risk Level";
      } else {
        riskBucket = "Suggested Risk Level";
      }

      return {
        id: portfolio.get('id'), // base64-encoded allocation
        group:  riskBucket,
        xValue: portfolio.get('annualRisk'),
        yValue: portfolio.get('annualReturn'),
      };
    });
  }

});
