import Ember from 'ember';
import { request as icAjaxRequest } from 'ic-ajax';

export default Ember.ObjectController.extend({

  ////////////////
  // Properties //
  ////////////////

  barData: null,
  lineData: null,
  loading: false,

  numberOfSimulationTrials: 500,


  /////////////////////////
  // Computed Properties //
  /////////////////////////

  displayChart: function() {
    var barData   = this.get('barData');
    var lineData  = this.get('lineData');
    return ( !Ember.isEmpty(barData) && !Ember.isEmpty(lineData) );
  }.property('barData', 'lineData'),


  /////////////
  // Actions //
  /////////////

  actions: {
    runSimulations: function() {
      var controller = this;
      var numberOfSimulationTrials = this.get('numberOfSimulationTrials');

      controller.set('loading', true);

      icAjaxRequest({
        url: window.RetirementPlanENV.apiHost + '/simulation',
        type: 'GET',
        data: { number_of_simulation_trials: numberOfSimulationTrials }
      }).then(function(simulationData) {
        // Need to munge data into graph format prior to use.
        var timeSteps = simulationData.simulations;
        var barData     = [];
        var lineData    = [];

        var numberOfGraphElements = 500; // Closure - used in functions below

        var resampleArray = function(arr, desiredLength) {
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
        };

        var asRelativeValues = function(arr) {
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
        };

        var dates = _.map(_.pluck(timeSteps, 'date'), function(dateInt) {
          // Change dates to unix milliseconds so work in Javascript
          return dateInt * 1000; // Unix milliseconds
        });

        var resampledDates = _.map(resampleArray(dates, numberOfGraphElements), function(millis) {
          return new Date(millis);
        });

        var pushGraphData = function(sourceObject, key, target, title) {
          // Even pushing the _.pluck into this function, so we don't have to
          // create 6+ fully loaded arrays
          var array = _.pluck(sourceObject, key);
          _.forEach(asRelativeValues(resampleArray(array, numberOfGraphElements)), function(el, index) {
            target.pushObject({
              "label": title,
              "time": resampledDates[index],
              "value": el
            });
          });
        };

        pushGraphData(timeSteps, 'assets_mean', lineData, "Assets (Mean)");
        pushGraphData(timeSteps, 'assets_ci_high', lineData, "Assets (95% Confidence Low)");
        pushGraphData(timeSteps, 'assets_ci_low', lineData, "Assets (95% Confidence High)");
        pushGraphData(timeSteps, 'income_mean', lineData, "Income (Mean)");
        pushGraphData(timeSteps, 'expenses_mean', lineData, "Expenses (Mean)");
        pushGraphData(timeSteps, 'out_of_money_percentage', barData, "Out of Money Occurences (% of Trials)");

        controller.set('barData', barData);
        controller.set('lineData', lineData);
        controller.set('loading', false);
      });

    }
  }

});
