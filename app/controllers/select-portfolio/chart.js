import Ember from 'ember';
import { request as icAjaxRequest } from 'ic-ajax';
import Portfolio from 'retirement-plan/models/portfolio';
import roundTo from 'retirement-plan/utils/round-to';

export default Ember.ArrayController.extend({
  // Model/content: Array of portfolios from server corresponding to checkboxes

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

  selectedTickers: Ember.computed.alias('controllers.selectPortfolio.selectedTickers'),

  ensureGraphRendered: function() {
    // This runs every time the route is accessed (including the first time).
    // Manually fire the `selectedTickers` observer. We don't "get" this property
    // in the template, therefore the observer doesn't fire unless we notify,
    // or over-ride the `init` function on the controller.
    this.notifyPropertyChange('selectedTickers');
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

  allSecurities: Ember.computed.alias('controllers.selectPortfolio.content'),

  selectedTickersCount: function() {
    return this.get('selectedTickers').length || 0;
  }.property('selectedTickers.@each'),

  selectedAnyTickers: Ember.computed.gt('selectedTickersCount', 0),

  selectedEnoughTickers: Ember.computed.gte('selectedTickersCount', 2),

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
    return Portfolio.allocationFromID(portfolioID);
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
    var allocation    = JSON.parse(this.get('allocation'));
    var allSecurities = this.get('allSecurities');
    return _.transform(allocation, function(memo, percentageAllocation, ticker) {
      var percentageFormatted = percentageAllocation * 100;
      var tickerDescription   = allSecurities.findBy('ticker', ticker).get('assetClass');
      memo.push({ "label": tickerDescription, "value": percentageFormatted });
      return true;
    }, []);
  }.property('allocation'),
  ///////////////////////


  ///////////////
  // Observers //
  ///////////////

  selectedTickersChanged: function() {
    // User selected different assets classes. Get the new efficient frontier (
    // which updates the graph).
    var tickerArray = this.get('selectedTickers');

    // Debounce this function - it gets called multiple times on the original
    // route load, and is expensive to calculate efficient frontiers on the server
    Ember.run.debounce(this, this._updateGraph, tickerArray, 100);
  }.observes('selectedTickers'),


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
      if ( indexOfSelectedPortfolio < 0 || indexOfSelectedPortfolio == (this.get('length') - 1) ) {
        return null;
      }

      desiredSelectedID = this.mapBy('id')[indexOfSelectedPortfolio + 1];
      this.set('selectedPortfolioID', desiredSelectedID);
    }

  },


  /////////////////////////
  // 'Private' functions //
  /////////////////////////

  _updateGraph: function(tickerArray) {
    if (!tickerArray || tickerArray.length < 1) { return null; }
    var controller = this;
    controller.set('loadingFrontier', true);
    controller._getEfficientFrontier(tickerArray).then( function(portfolios) {
      controller.set('content', portfolios);
      controller.set('loadingFrontier', false);
    });
  },

  _getEfficientFrontier: function(tickerArray) {
    var controller = this;

    return new Ember.RSVP.Promise(function(resolve) {
      if (tickerArray.length > 1) { // Not allowing single-asset portfolios
        icAjaxRequest({
          url:  window.RetirementPlanENV.apiHost + '/efficient_frontier',
          type: 'GET',
          data: { tickers: tickerArray }
        }).then( function(efficientFrontierData) {
          var prattArrowLow     = controller.get('currentUser.prattArrowLow');
          var prattArrowHigh    = controller.get('currentUser.prattArrowHigh');
          var portfolios        = [];
          var rawPortfolioData  = efficientFrontierData.efficient_frontier;
          _.forEach(rawPortfolioData, function(portfolio) {
            portfolio.prattArrowLow   = prattArrowLow;
            portfolio.prattArrowHigh  = prattArrowHigh;
            portfolios.pushObject(Portfolio.create(portfolio));
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
