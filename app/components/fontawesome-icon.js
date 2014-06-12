import Ember from 'ember';

var FontawesomeIconComponent = Ember.Component.extend({
  // Bound:
  // - type

  tagName: 'i',
  classNameBindings: [':fa', 'faType'],

  faType: function() {
    return 'fa-' + this.get('type');
  }.property('type')

});

export default FontawesomeIconComponent;
