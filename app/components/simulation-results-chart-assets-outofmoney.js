/* global c3, accounting */

// There is duplication between this and the other simulation timeseries chart.
// Not going to extract a base component yet though.

import Ember from 'ember';
import roundTo from 'retirement-plan/utils/round-to';
import resampleArray from 'retirement-plan/utils/resample-array';
import secondsToDate from 'retirement-plan/utils/seconds-to-date';

export default Ember.Component.extend({

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
        format: function(val) { return accounting.formatMoney(val); }
      },
      label: {
        text: 'Assets ($)',
        position: 'outer-middle'
      }
    },
    y2: {
      show: true,
      tick: {
        fit: false,
        format: function(val) {
          var percentage = val * 100.0;
          return '' + roundTo(percentage, 1) + '%';
        }
      },
      label: {
        text: 'Out of Money Occurences (%)',
        position: 'outer-middle'
      },
      max: 1.0,
      min: 0.0,
      padding: {top: 0, bottom: 0}
    },
  },


  //////////////////////
  // Component Hooks //
  /////////////////////

  didInsertElement: function() {
    var elementId = this.get('elementId');
    var data      = this.get('data');
    var axis      = this.get('axis');

    var chart = c3.generate({
      bindto: '#' + elementId,
      data: data,
      axis: axis,
    });

    this.set('chart', chart);
  },

  ///////////////
  // Observers //
  ///////////////

  dataChanged: function() {
    var timeSteps  = this.get('timeSteps');
    if (Ember.isNone(timeSteps)) {return null;}
    this.set('data', this._processData(timeSteps));
  }.observes('timeSteps').on('init'),


  //////////////////
  // Data Munging //
  //////////////////

  _processData: function(timeSteps) {
    var numberOfGraphElements = 300;

    var resampledDates  = resampleArray(_.pluck(timeSteps, 'date'), numberOfGraphElements);
    var jsDates         = _.map(resampledDates, secondsToDate);

    var resampled = function(key) {
      return resampleArray(_.pluck(timeSteps, key), numberOfGraphElements);
    };

    // Not using assets_ci_high and assets_ci_low right now - always very similar
    // on the scale of the graph
    var json = {
      jsDates: jsDates,
      "Assets (Mean)": resampled('assets_mean'),
      "Out of Money Occurences (% of Trials)": resampled('out_of_money_percentage'),
    };

    return {
      x:    'jsDates',
      type: 'line',
      types: {
        "Out of Money Occurences (% of Trials)": 'area',
      },
      json: json,
      axes: {
        "Assets (Mean)": "y",
        "Out of Money Occurences (% of Trials)": "y2"
      }
    };
  },

});
