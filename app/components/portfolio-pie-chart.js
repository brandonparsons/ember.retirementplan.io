import Ember from 'ember';
import chartColor from 'retirement-plan/utils/chart-color';

export default Ember.Charts.PieComponent.extend({

  ///////////////////////////////////////
  // Ember Charts Component Over-Rides //
  ///////////////////////////////////////

  formatValue: window.d3.format('.1%'),


  ////////////////////////
  // Default Selections //
  ////////////////////////

  maxRadius: 100,
  maxSlicePercent: 100,
  minSlicePercent: 1,
  maxNumberOfSlices: 20,
  selectedSeedColor: chartColor('green'),
  selectedSortType: 'value', // 'label'

});
