import Ember from 'ember';

export default Ember.Component.extend({
  type: 'default',
  heading: null, // can bind
  footer: null,  // can bind
  classNameBindings: ['panelType'],

  panelType: function() {
    return 'panel ' + 'panel-' + this.get('type');
  }.property('type')

});
