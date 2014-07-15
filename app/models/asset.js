import DS from 'ember-data';

export default DS.Model.extend({
  assetClass:     DS.attr('string'),
  assetType:      DS.attr('string'),
});
