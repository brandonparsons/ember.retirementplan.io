import Ember from 'ember';
import { request as icAjaxRequest } from 'ic-ajax';

export default Ember.ObjectController.extend({

  ////////////////
  // Properties //
  ////////////////

  barData: null,
  lineData: null,
  loading: false,

  numberOfSimulationTrials: 1000,


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
        // Need to replace all the times (e.g. 2013-08-15) with d3 times prior
        // to use.
        var formatDate, transformObject, reduceFunction, barData, lineData;

        formatDate = function(dateString) {
          return window.d3.time.format('%Y-%m-%d').parse(dateString);
        };
        transformObject = function(object) {
          var newObject = {};
          _.forEach(object, function(value, key) {
            if (key === 'time') {
              newObject[key] = formatDate(value);
            } else {
              newObject[key] = value;
            }
          });
          return newObject;
        };
        reduceFunction = function(ary, entryObject) {
          var transformed = transformObject(entryObject);
          ary.pushObject(transformed);
          return ary;
        };

        barData   = _.reduce(simulationData.bar_data, reduceFunction, []);
        lineData  = _.reduce(simulationData.line_data, reduceFunction, []);

        controller.set('barData', barData);
        controller.set('lineData', lineData);
        controller.set('loading', false);
      });

    }
  }

});
