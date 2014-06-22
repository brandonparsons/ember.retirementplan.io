import Ember from 'ember';

var FontawesomeIconComponent = Ember.Component.extend({
  type: null, // Bound
  size: null, // Bound
  spin: false,

  withForcedSpace: true,

  tagName: 'i',
  classNameBindings: [':fa', 'faType', 'faSize', 'faSpin'],

  faType: function() {
    return 'fa-' + this.get('type');
  }.property('type'),

  faSize: function() {
    var size = this.get('size');
    if ( size === '1x' || Ember.isEmpty(size) ) {
      return null;
    } else if (size === '2x') {
      return 'fa-2x';
    } else if (size === '3x') {
      return 'fa-3x';
    } else {
      return null;
    }
  }.property('size'),

  faSpin: function() {
    if (this.get('spin')) {
      return 'fa-spin';
    } else {
      return null;
    }
  }.property('spin'),

});

export default FontawesomeIconComponent;
