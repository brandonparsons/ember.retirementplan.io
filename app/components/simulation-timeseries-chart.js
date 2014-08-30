/* global c3 */

import Ember from 'ember';
import roundTo from 'retirement-plan/utils/round-to';

export default Ember.Component.extend({

  tagName: 'div',
  classNames: ['BOUND-simulation-timeseries-chart'],


  //////////////////////////////////
  // Bound & Computed Properties //
  /////////////////////////////////

  timeSteps:  null,   // Bound
  chart:      null,   // Holds reference to the c3 graph


  ////////////////////////
  // C3 Graph Specifics //
  ////////////////////////

  data: {},

  axis: {
    x: {
      type: 'timeseries',
      tick: {
        fit: false,
        format: '%b-%Y'
      },
    },
    y: {
      tick: {
        fit: false,
        format: function(val) {
          var percentage = val * 100.0;
          return '' + roundTo(percentage, 1) + '%';
        }
      },
      label: {
        text: 'Relative Value',
        position: 'outer-middle'
      }
    },
  }, // axis


  //////////////////////
  // Component Hooks //
  /////////////////////

  didInsertElement: function() {
    var component = this;

    var chart = c3.generate({
      bindto:   '.BOUND-simulation-timeseries-chart',
      data:     component.get('data'),
      axis:     component.get('axis'),
    });

    component.set('chart', chart);
  },

  ///////////////
  // Observers //
  ///////////////

  dataChanged: function() {
    var timeSteps  = this.get('timeSteps');
    if (Ember.isNone(timeSteps)) {return null;}
    this.set('data', this._handleSimulationData(timeSteps));
  }.observes('timeSteps').on('init'),


  //////////////////
  // Data Munging //
  //////////////////

  _handleSimulationData: function(timeSteps) {
    var component, numberOfGraphElements, resampledDates, jsDates, mungeData,
      json, data;

    component             = this;
    numberOfGraphElements = 300; // Closure - used in functions below

    resampledDates  = component._resampleArray(_.pluck(timeSteps, 'date'), numberOfGraphElements);
    jsDates         = _.map(resampledDates, component._asDate);

    mungeData = function(sourceObject, key, target, asRelativeValues, title) {
      var array = _.pluck(sourceObject, key);
      var resampled = component._resampleArray(array, numberOfGraphElements);
      if (asRelativeValues) {
        target[title] = component._asRelativeValues(resampled);
      } else {
        target[title] = resampled;
      }
      return true;
    };

    json = {
      jsDates: jsDates
    };

    mungeData(timeSteps, 'assets_mean',             json, true, "Assets (Mean)");
    mungeData(timeSteps, 'assets_ci_high',          json, true, "Assets (95% Confidence Low)");
    mungeData(timeSteps, 'assets_ci_low',           json, true, "Assets (95% Confidence High)");
    mungeData(timeSteps, 'income_mean',             json, true, "Income (Mean)");
    mungeData(timeSteps, 'expenses_mean',           json, true, "Expenses (Mean)");
    mungeData(timeSteps, 'out_of_money_percentage', json, false, "Out of Money Occurences (% of Trials)");

    data = {
      x:    'jsDates',
      type: 'bar',
      types: {
        "Assets (Mean)": 'line', // spline
        "Assets (95% Confidence Low)": 'line',
        "Assets (95% Confidence High)": 'line',
        "Out of Money Occurences (% of Trials)": 'area',
        // "Income (Mean)"
        // "Expenses (Mean)"
      },
      json: json,
    };

    return data;
  },

  _resampleArray: function(arr, desiredLength) {
    var chunked, itemsPerBucket;
    if (desiredLength > arr.length) {
      return arr;
    }
    itemsPerBucket = parseInt(arr.length / desiredLength);
    chunked = [];
    while (arr.length) {
      chunked.push(arr.splice(0, itemsPerBucket));
    }
    return _.map(chunked, function(chunk) {
      var total;
      total = _.reduce(chunk, function(sum, val) {
        return sum += val;
      }, 0.0);
      return total / chunk.length;
    });
  },

  _asRelativeValues: function(arr) {
    var max, min, spread;
    max     = _.max(arr);
    min     = _.min(arr);
    spread  = max - min;
    if (spread === 0.0) {
      // If is always zero (spread == 0), divides by zero and blows up.
      // Just return the original array as it is (probably?) always a pile
      // of zeroes in this case.
      return arr;
    } else {
      return _.map(arr, function(el) {
        return (el - min) / spread; // Not dividing by 100 - already taken care of by d3
      });
    }
  },

  _asDate: function(unixSeconds) {
    return new Date(unixSeconds * 1000);
  },

});
