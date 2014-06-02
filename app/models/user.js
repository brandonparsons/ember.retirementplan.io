export default DS.Model.extend({
  email:            DS.attr('string'),
  name:             DS.attr('string'),
  image:            DS.attr('string'),
  hasPassword:      DS.attr('boolean'),

  authentications:  DS.hasMany('authentication', {async: true})
});
