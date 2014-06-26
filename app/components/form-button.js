import Ember from 'ember';

export default Ember.Component.extend({
  tagName:    'a',

  classNames: ['btn', 'btn-default'],
  classNameBindings: ['spaceType'],

  text:      'Cancel',
  spaceType: 'space-left-large',

  click: function() {
    this.sendAction();
  }
});
