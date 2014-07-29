/* global moment */

import Ember from 'ember';
import { request as icAjaxRequest } from 'ic-ajax';
import roundTo from 'retirement-plan/utils/round-to';
import numberToCurrency from 'retirement-plan/utils/number-to-currency';

export default Ember.ObjectController.extend({

  ////////////////
  // Properties //
  ////////////////

  loading:            false,
  barData:            null,
  lineData:           null,
  writtenContentData: null,

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
        var formattedData       = controller._handleSimulationData(simulationData.simulations);
        var writtenContentData  = controller._summarizeData(simulationData.simulations);
        controller.set('loading', false);
        controller.set('barData', formattedData.barData);
        controller.set('lineData', formattedData.lineData);
        controller.set('writtenContentData', writtenContentData);
      });

    }
  },


  ///////////////////////
  // Private Functions //
  ///////////////////////

  _handleSimulationData: function(timeSteps) {
    var controller  = this;
    var barData     = [];
    var lineData    = [];

    var numberOfGraphElements = 500; // Closure - used in functions below

    var resampledDates = controller._resampleArray(_.pluck(timeSteps, 'date'), numberOfGraphElements);
    var jsDates = _.map(resampledDates, controller._asDate);

    var pushGraphData = function(sourceObject, key, target, title) {
      // Even pushing the _.pluck into this function, so we don't have to
      // create 6+ fully loaded arrays
      var array = _.pluck(sourceObject, key);
      _.forEach(controller._asRelativeValues(controller._resampleArray(array, numberOfGraphElements)), function(el, index) {
        target.pushObject({
          "label": title,
          "time": jsDates[index],
          "value": el
        });
      });
    };

    pushGraphData(timeSteps, 'assets_mean',             lineData, "Assets (Mean)");
    pushGraphData(timeSteps, 'assets_ci_high',          lineData, "Assets (95% Confidence Low)");
    pushGraphData(timeSteps, 'assets_ci_low',           lineData, "Assets (95% Confidence High)");
    pushGraphData(timeSteps, 'income_mean',             lineData, "Income (Mean)");
    pushGraphData(timeSteps, 'expenses_mean',           lineData, "Expenses (Mean)");
    pushGraphData(timeSteps, 'out_of_money_percentage', barData,  "Out of Money Occurences (% of Trials)");

    return {
      barData: barData,
      lineData: lineData
    };
  },

  _summarizeData: function(timeSteps) {
    var controller,
      outOfMoneyResults, assetsMeanResults, incomeMeanResults, expensesMeanResults,
      jsDates, numberOfResults, groupedOutOfMoneyOccurences, outcomePercentages,
      inDanger, summaryMessage, summaryClass, outOfMoneyMessage, maxAssets,
      maxAssetsDate, assetsMessage;

    controller = this;

    outOfMoneyResults   = _.pluck(timeSteps, 'out_of_money_percentage');
    assetsMeanResults   = _.pluck(timeSteps, 'assets_mean');
    incomeMeanResults   = _.pluck(timeSteps, 'income_mean');
    expensesMeanResults = _.pluck(timeSteps, 'expenses_mean');
    jsDates             = _.map( _.pluck(timeSteps, 'date'), controller._asDate);

    numberOfResults = outOfMoneyResults.length;
    groupedOutOfMoneyOccurences = _.countBy(outOfMoneyResults, function(result) {
      var resultPercentage = result * 100.0;
      if (resultPercentage >= 99.0) {
        return "certain";
      } else if (resultPercentage >= 90.0) {
        return "likely";
      } else if (resultPercentage < 10.0) {
        return "unlikely";
      } else {
        return "uncertain";
      }
    });
    outcomePercentages = _.reduce( groupedOutOfMoneyOccurences, function(memo, val, key) {
      memo[key] = roundTo( (window.parseFloat(val) / numberOfResults) * 100, 1);
      return memo;
    }, {});

    inDanger = _.any(outOfMoneyResults, function(el) { return el > 0.10; });

    if (inDanger) {
      summaryMessage = "At least one of the simulation timesteps (months) showed you running out of money more than 10% of the time. Please consider adjusting your expenses, retirement dates, or your chosen portfolio risk.";
      summaryClass = "danger";
    } else {
      summaryMessage = "Your chances of running out of money during retirement were less than 10% in every simulation timestep (month). This could be an acceptable combination of assets / financial goals.";
      summaryClass = "success";
    }

    outOfMoneyMessage = [
      "Your assets were 'certainly' less than zero (i.e. you had ran out of money) in " +
        (outcomePercentages.certain || 0) + "% of the simulated months",
      "Your assets were likely less than zero in " +
        (outcomePercentages.likely || 0) + "% of the simulated months",
      "Your assets were likely greater than zero (i.e. you had not ran out of money) in " +
        (outcomePercentages.unlikely || 0) + "% of the simulated months",
    ];

    maxAssets     = _.max(assetsMeanResults);
    maxAssetsDate = jsDates[_.indexOf(assetsMeanResults, maxAssets)];
    assetsMessage = "The maximum value of your invested assets was " + numberToCurrency(maxAssets) +
      " which occurs on " + moment(maxAssetsDate).format("LL");

    return {
      "summaryMessage": summaryMessage,
      "summaryClass":   summaryClass,
      "outOfMoney":     outOfMoneyMessage,
      "assets":         assetsMessage
    };
  },

  _asDate: function(unixSeconds) {
    return new Date(unixSeconds * 1000);
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


});
