import Ember from 'ember';
import chartColor from 'retirement-plan/utils/chart-color';

export default Ember.Charts.TimeSeriesComponent.extend({

  ///////////////////////////////////////
  // Ember Charts Component Over-Rides //
  ///////////////////////////////////////

  barPadding: 0,
  barGroupPadding: 0.25,
  stackBars: false,
  yAxisFromZero: true,
  selectedInterval: 'M', // 'W' weeks 'M' months 'Q' quarters 'Y' years

  formatValue:      window.d3.format('.1%'),
  formatValueLong:  window.d3.format('.1%'),
  // formatValue:      d3.format('.2s'),
  // formatValueLong:  d3.format(',.r'),

  selectedSeedColor: chartColor('green'),

});
