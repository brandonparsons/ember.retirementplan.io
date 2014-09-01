import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',

  textColor: 'text-info',
  helpBlock: false, // Bound

  classNames: ['row'],
  classNameBindings: ['textColor']

});
