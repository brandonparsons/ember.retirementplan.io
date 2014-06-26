import DS from 'ember-data';

export default DS.Model.extend({
  weights:        DS.attr('object'),
  currentShares:  DS.attr('object'),
  selectedEtfs:   DS.attr('object'),
  tracking:       DS.attr('boolean'),
});
