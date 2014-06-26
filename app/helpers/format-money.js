/* global accounting */

import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(number) {
  if (number === null) { return ''; }
  return accounting.formatMoney(number);
});
