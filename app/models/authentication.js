export default DS.Model.extend({
  uid:        DS.attr('string'),
  provider:   DS.attr('string'),

  user:       DS.belongsTo('user'),

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
