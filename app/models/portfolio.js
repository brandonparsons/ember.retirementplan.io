import Ember from 'ember';

export default Ember.Object.extend({

  prettyAllocation: function() {
    var allocation      = this.get('allocation');
    var startingString  = "Allocation: ";
    return _.reduce(allocation, function(memo, weight, key) {
      var roundedWeight, asText;

      roundedWeight = Math.round(weight*100);
      asText = roundedWeight.toString() + "%"

      return memo + " || " + key + " " + asText + " || ";
    }, startingString);
  }.property('allocation'),

  prettyStatistics: function() {
    return JSON.stringify(this.get('statistics'))
  }.property('statistics')

})
