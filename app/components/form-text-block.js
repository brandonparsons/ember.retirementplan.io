import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',

  textColor: 'color-green',
  helpBlock: false, // Bound

  classNames: ['row'],
  classNameBindings: ['textColor']

});
