export default DS.Model.extend({
  description:  DS.attr('string'),
  amount:       DS.attr('number'),
  frequency:    DS.attr('string'),
  ends:         DS.attr('date'),
  onetimeOn:    DS.attr('date'),
  notes:        DS.attr('string'),
  isAdded:      DS.attr('boolean')
});
