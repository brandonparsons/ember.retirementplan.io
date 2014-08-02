/* global c3 */

import Ember from 'ember';
import roundTo from 'retirement-plan/utils/round-to';

export default Ember.Component.extend({

  //////////////////////////////////
  // Bound & Computed Properties //
  /////////////////////////////////

  selectedPortfolioID:  null, // Bound
  portfolios:           null, // Bound

  hasSelectedPortfolio: Ember.computed.notEmpty('selectedPortfolioID'),

  leftArrowDisabled: function() {
    var indexOfSelectedPortfolio = this.get('portfolios').mapBy('id').indexOf(this.get('selectedPortfolioID'));
    return indexOfSelectedPortfolio <= 0;
  }.property('selectedPortfolioID'),

  rightArrowDisabled: function() {
    var indexOfSelectedPortfolio = this.get('portfolios').mapBy('id').indexOf(this.get('selectedPortfolioID'));
    return indexOfSelectedPortfolio === this.get('portfolios').get('length') - 1;
  }.property('selectedPortfolioID'),


  ////////////////////////
  // C3 Graph Specifics //
  ////////////////////////

  chart: null, // Holds reference to the c3 graph

  data: null,
  grid: null,

  legend: {
    show: false
  },

  axis: {
    x: {
      tick: {
        fit: false,
        format: function(val) {
          var percentage = val * 100.0;
          return roundTo(percentage, 1);
        }
      },
      label: {
        text: 'Annual Expected Risk (Standard Deviation - %)',
        position: 'outer-middle'
      }
    },
    y: {
      tick: {
        fit: false,
        format: function(val) {
          var percentage = val * 100.0;
          return roundTo(percentage, 1);
        }
      },
      label: {
        text: 'Annual Expected Return (%)',
        position: 'outer-middle'
      }
    }
  },

  tooltip: {
    format: {
      title: function (d) { return 'Risk (Annual Std. Deviation): ' + roundTo(d*100, 1) + '%'; },
      value: function (value) {
        return roundTo(value*100, 1) + '%';
      }
    }
  },


  ///////////////
  // Observers //
  ///////////////

  portfoliosChanged: function() {
    var component, portfolios, portfolioSelected, optimalRiskUtilityLow,
      optimalRiskUtilityHigh, data, grid, chart;

    component   = this;
    portfolios  = this.get('portfolios');

    if (Ember.isEmpty(portfolios)) { return; }


    /* Munge graph data into format ember-c3 expects */

    portfolioSelected = function(selectedPointData) {
      var portfolio = portfolios[selectedPointData.index];
      component.set('selectedPortfolioID', portfolio.get('id'));
    };

    optimalRiskUtilityLow = _.max(portfolios, function(portfolio) {
      return portfolio.get('utilityLow');
    }).get('annualRisk');

    optimalRiskUtilityHigh = _.max(portfolios, function(portfolio) {
      return portfolio.get('utilityHigh');
    }).get('annualRisk');

    data = {
      x: "Risk (Std Deviation)",
      json: {
        "Risk (Std Deviation)":   portfolios.mapBy('annualRisk'),
        "Expected Annual Return": portfolios.mapBy('annualReturn'),
      },
      type: 'scatter',
      selection: {
        enabled: true,
        multiple: false,
      },
      onselected: portfolioSelected,
    };

    grid = {
      x: {
        lines: [
          { value: optimalRiskUtilityLow,  text: 'Low Risk Region' },
          { value: optimalRiskUtilityHigh, text: 'Suggested Risk Region' },
        ]
      }
    };

    component.set('data', data);
    component.set('grid', grid);

    // This will (hopefully) update the chart if it already exists (as opposed
    // to on init). This doesn't get called at the moment as the controller
    // currently tears everything down when the asset classes change.
    chart = component.get('chart');
    if (chart) {
      chart.load({
        data: data,
        grid: grid
      });
    }

    /* */

  }.observes('portfolios.@each').on('init'), // Do on init so graph values set prior to didinsertElement


  //////////////////////
  // Component Hooks //
  /////////////////////

  didInsertElement: function() {
    var component, data, grid, chart, selectedPortfolioID;

    component = this;

    data = component.get('data') || {
      x: "Risk (Std Deviation)",
      json: {
        "Risk (Std Deviation)":     [],
        "Expected Annual Return":   [],
      }
    };

    grid = component.get('grid') || {};

    chart = c3.generate({
      bindto:   '.BOUND-portfolio-scatter-chart',
      data:     data,
      grid:     grid,
      axis:     component.get('axis'),
      legend:   component.get('legend'),
      tooltip:  component.get('tooltip'),
    });

    component.set('chart', chart);

    // If they have selected a portfolio, make sure it is highlighted on entering the route
    selectedPortfolioID = component.get('selectedPortfolioID');
    if (!Ember.isNone(selectedPortfolioID)) {
      chart.select(['Expected Annual Return'], [component.get('portfolios').mapBy('id').indexOf(selectedPortfolioID)], true);
    }
  },

  /////////////
  // Actions //
  /////////////

  actions: {

    selectPortfolioLeft: function() {
      var selectedPortfolioID, portfolios, portfolioIds, indexOfSelectedPortfolio,
        desiredSelectedID, chart;

      portfolios          = this.get('portfolios');
      portfolioIds        = portfolios.mapBy('id');
      selectedPortfolioID = this.get('selectedPortfolioID');
      if (!selectedPortfolioID) { return null; }

      indexOfSelectedPortfolio = portfolioIds.indexOf(selectedPortfolioID);

      // Can't move left from 0, or if item not found (-1)
      if (indexOfSelectedPortfolio <= 0) { return null; }

      desiredSelectedID = portfolioIds[indexOfSelectedPortfolio - 1];
      this.set('selectedPortfolioID', desiredSelectedID);

      // Move the "selected bubble" on the graph
      chart = this.get('chart');
      chart.select(['Expected Annual Return'], [portfolioIds.indexOf(desiredSelectedID)], true);
    },

    selectPortfolioRight: function() {
      var selectedPortfolioID, portfolios, portfolioIds, indexOfSelectedPortfolio,
      desiredSelectedID, chart;

      portfolios          = this.get('portfolios');
      portfolioIds        = portfolios.mapBy('id');
      selectedPortfolioID = this.get('selectedPortfolioID');
      if (!selectedPortfolioID) { return null; }

      indexOfSelectedPortfolio  = portfolioIds.indexOf(selectedPortfolioID);

      // Can't move right from last item, or if item not found (-1)
      if ( indexOfSelectedPortfolio < 0 || indexOfSelectedPortfolio === (portfolios.get('length') - 1) ) {
        return null;
      }

      desiredSelectedID = portfolioIds[indexOfSelectedPortfolio + 1];
      this.set('selectedPortfolioID', desiredSelectedID);

      // Move the "selected bubble" on the graph
      chart = this.get('chart');
      chart.select(['Expected Annual Return'], [portfolioIds.indexOf(desiredSelectedID)], true);
    },

    saveSelectedPortfolio: function(selectedPortfolioID) {
      this.sendAction('action', selectedPortfolioID);
    }

  },

});


// /* Group portfolios by risk */
// // NOT USING RIGHT NOW: Just adding a vertical gridline to separate sets.
// // If you want to split into separate data sets by risk, this is how -
// // C3's selection functionality doesn't seem to work with mult. data sets though

// var optimalRiskUtilityLow = _.max(portfolios, function(portfolio) {
//   return portfolio.get('utilityLow');
// }).get('annualRisk');

// var optimalRiskUtilityHigh = _.max(portfolios, function(portfolio) {
//   return portfolio.get('utilityHigh');
// }).get('annualRisk');

// var groupedPortfolios = portfolios.map( function(portfolio) {
//   var thisPortfoliosRisk, riskBucket;

//   thisPortfoliosRisk = portfolio.get('annualRisk');
//   // riskBucket string values depended on elsewhere (at time of writing), be
//   // careful if changing (can search for them)
//   if (thisPortfoliosRisk < optimalRiskUtilityLow) {
//     riskBucket = "Low Risk Level";
//   } else if (thisPortfoliosRisk > optimalRiskUtilityHigh) {
//     riskBucket = "High Risk Level";
//   } else {
//     riskBucket = "Suggested Risk Level";
//   }

//   return {
//     id:     portfolio.get('id'), // base64-encoded allocation
//     group:  riskBucket,
//     xValue: portfolio.get('annualRisk'),
//     yValue: portfolio.get('annualReturn'),
//   };
// });

// /* */
