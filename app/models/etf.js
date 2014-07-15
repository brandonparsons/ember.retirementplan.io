import DS from 'ember-data';

export default DS.Model.extend({
  ticker:       DS.attr('string'),
  description:  DS.attr('string'),

  asset: DS.belongsTo('asset')
});
