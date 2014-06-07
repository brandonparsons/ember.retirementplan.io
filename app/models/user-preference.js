export default DS.Model.extend({
  allowableDrift:         DS.attr('number'),
  maxContactFrequency:    DS.attr('number'),
  minRebalanceSpacing:    DS.attr('number')
});
