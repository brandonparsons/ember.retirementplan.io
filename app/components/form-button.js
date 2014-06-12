import Ember from 'ember';

export default Ember.Component.extend({
  tagName:    'a',
  classNames: ['btn', 'btn-default', 'space-left-large'],
  text:       'Cancel',

  click: function() {
    this.sendAction();
  }
});
