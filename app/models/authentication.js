export default DS.Model.extend({

  ////////////////
  // Properties //
  ////////////////

  uid:        DS.attr('string'),
  provider:   DS.attr('string'),


  ///////////////////
  // Associations //
  //////////////////

  user:       DS.belongsTo('user'),


  /////////////////////////
  // Computed Properties //
  /////////////////////////

  fontawesomeIconClass: function () {
    var provider = this.get('provider');
    if (provider === 'facebook') {
      return 'fa fa-facebook-square';
    } else if (provider === 'google') {
      return 'fa fa-google-plus-square';
    } else {
      throw new Error('Invalid provider');
    }
  }.property('provider')

});
