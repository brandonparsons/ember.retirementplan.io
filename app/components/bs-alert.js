import Ember from 'ember';

export default Ember.Component.extend({
  type: 'info',

  classNameBindings: [':alert', 'alertType', ':alert-dismissable', ':fade', ':in'],

  alertType: function() {
    return 'alert-' + this.get('type');
  }.property('type')

});
