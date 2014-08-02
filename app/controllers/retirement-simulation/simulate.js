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
  timeStepResults:    null,
  writtenContentData: null,

  numberOfSimulationTrials: 500,


  /////////////////////////
  // Computed Properties //
  /////////////////////////

  haveChartToDisplay: function() {
    return ( !Ember.isEmpty(this.get('timeStepResults')) );
  }.property('timeStepResults'),


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
        controller.set('loading', false);
        controller.set('timeStepResults',     simulationData.simulations);
        controller.set('writtenContentData',  controller._summarizeData(simulationData.simulations));
      });
    },

    rerunSimulation: function() {
      this.send('runSimulations');
    },
  },


  ///////////////////////
  // Private Functions //
  ///////////////////////

  _summarizeData: function(timeSteps) {
    // Computes the written summary below the graph.
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

});
