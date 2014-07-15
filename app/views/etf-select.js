import Ember from 'ember';

export default Ember.Select.extend({
  asset: null,  // Bound
  etfs: null,   // Bound

  content:      Ember.computed.alias('etfs'),
  selectedEtf:  Ember.computed.alias('selection'),

  optionValuePath: "content.ticker",
  optionLabelPath: "content.description",
});
