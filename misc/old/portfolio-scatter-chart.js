/* global c3 */

import Ember from 'ember';
import roundTo from 'retirement-plan/utils/round-to';

export default Ember.Component.extend({

  tagName:    'div',
  classNames: ['BOUND-portfolio-scatter-chart'],


  ///////////////
  // Observers //
  ///////////////

  portfoliosChanged: function() {
    this._updateGraphData();
    this.get('chart').load({
      data: this.get('data'),
      grid: this.get('grid')
    });
    this._highlightSelectedPortfolio();
  }.observes('portfolios.@each'),


  //////////////////////
  // Component Hooks //
  /////////////////////

  init: function() {
    this._super();
    this._updateGraphData();
  },

  didInsertElement: function() {
    var component = this;
    var chart = c3.generate({
      bindto:   '.BOUND-portfolio-scatter-chart',
      data:     component.get('data'),
      grid:     component.get('grid'),
      axis:     component.get('axis'),
      legend:   component.get('legend'),
      tooltip:  component.get('tooltip'),
    });
    component.set('chart', chart);
    component._highlightSelectedPortfolio();
  },


  /////////////////////////////
  // C3 Graph Customizations //
  /////////////////////////////

  data: {},
  grid: {},

  legend: { show: false },

  axis: {
    x: {
      tick: {
        fit: false,
        format: function(val) {
          return roundTo((val * 100.0), 1);
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
          return roundTo((val * 100.0), 1);
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


  /////////////////////////
  // 'Private' Functions //
  /////////////////////////

  _updateGraphData: function() {
    var component   = this;
    var portfolios  = this.get('portfolios');

    var portfolioSelected = function(selectedPointData) {
      var portfolio = portfolios[selectedPointData.index];
      component.sendAction('selectPortfolio', portfolio);
    };

    var data = {
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

    var optimalRiskUtilityLow = _.max(portfolios, function(portfolio) {
      return portfolio.get('utilityLow');
    }).get('annualRisk');
    var optimalRiskUtilityHigh = _.max(portfolios, function(portfolio) {
      return portfolio.get('utilityHigh');
    }).get('annualRisk');

    var grid = {
      x: {
        lines: [
          { value: optimalRiskUtilityLow,  text: 'Low Risk Region' },
          { value: optimalRiskUtilityHigh, text: 'Suggested Risk Region' },
        ]
      }
    };

    component.set('data', data);
    component.set('grid', grid);
  },

  _highlightSelectedPortfolio: function() {
    var portfolios              = this.get('portfolios');
    var selectedPortfolioIndex  = portfolios.indexOf(portfolios.findBy('selected', true));
    if (selectedPortfolioIndex >= 0) {
      this.get('chart').select(['Expected Annual Return'], [selectedPortfolioIndex], true);
    } else {
      return null;
    }
  },

});
