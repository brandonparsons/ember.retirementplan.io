import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['row'],

  text: null, // Bound

  levelTwo: false, // Bound if you want it
  levelOne: Ember.computed.not('levelTwo'),
});
