export default DS.Model.extend({

  ////////////////
  // Properties //
  ////////////////

  email:            DS.attr('string'),
  name:             DS.attr('string'),
  image:            DS.attr('string'),
  hasPassword:      DS.attr('boolean'),
  confirmed:        DS.attr('boolean'),


  ///////////////////
  // Associations //
  //////////////////

  authentications:  DS.hasMany('authentication', {async: true}),


  /////////////////////////
  // Computed Properties //
  /////////////////////////

  authenticationCount: function() {
    return this.get('authentications.length');
  }.property('authentications.@each')

});
