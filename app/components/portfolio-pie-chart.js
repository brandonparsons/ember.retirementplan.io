/* global c3 */

import Ember from 'ember';
import roundTo from 'retirement-plan/utils/round-to';

export default Ember.Component.extend({

  tagName: 'div',
  classNames: ['BOUND-portfolio-pie-chart', 'text-center'],


  //////////////////////////////////
  // Bound & Computed Properties //
  /////////////////////////////////

  allocation:   null, // Bound
  assetClasses: null, // Bound
  chart: null,        // Holds reference to the c3 graph


  ////////////////////////
  // C3 Graph Specifics //
  ////////////////////////

  data: function() {
    var allocation    = this.get('allocation');
    var assetClasses  = this.get('assetClasses');
    var formattedData = _.reduce(allocation, function(memo, percentageAllocation, id) {
      var percentageFormatted = roundTo(percentageAllocation * 100, 1);
      var description         = assetClasses.findBy('id', id).get('assetClass');
      memo[description]       = percentageFormatted;
      return memo;
    }, {});

    return {
      json:   formattedData,
      type :  'pie',
    };
  }.property('allocation', 'assetClasses'),

  dataChanged: function() {
    this.get('chart').load(this.get('data'));
  }.observes('data'),

  pie: {
    // onclick:     function (d, i) { console.log(d, i); },
    // onmouseover: function (d, i) { console.log(d, i); },
    // onmouseout:  function (d, i) { console.log(d, i); }
  },


  //////////////////////
  // Component Hooks //
  /////////////////////

  didInsertElement: function() {
    var component = this;

    var chart = c3.generate({
      bindto: '.BOUND-portfolio-pie-chart',
      data:   component.get('data'),
      pie:    component.get('pie'),
    });

    component.set('chart', chart);
  },


});
