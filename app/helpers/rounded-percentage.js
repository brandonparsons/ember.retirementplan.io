/* global accounting */

import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(decimalPercentage) {
  if (decimalPercentage === null) { return ''; }
  return '' + accounting.toFixed(decimalPercentage*100, 1) + '%';
});
