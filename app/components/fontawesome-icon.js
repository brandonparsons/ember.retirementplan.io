import Ember from 'ember';

var FontawesomeIconComponent = Ember.Component.extend({
  type: null, // expected ta be bound

  withForcedSpace: true,

  tagName: 'i',
  classNameBindings: [':fa', 'faType'],

  faType: function() {
    return 'fa-' + this.get('type');
  }.property('type')

});

export default FontawesomeIconComponent;
