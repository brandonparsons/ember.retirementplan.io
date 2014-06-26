import Ember from 'ember';

export default Ember.Select.extend({
  security: null, // Bound
  etfs: null,     // Bound

  selectedEtf:  Ember.computed.alias('selection'),
  content:      Ember.computed.alias('etfs'),
});
