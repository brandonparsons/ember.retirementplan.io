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

  selectedSeedColor: chartColor('green'),

});
