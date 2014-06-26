import Ember from 'ember';
import DS from 'ember-data';

// Source: http://stackoverflow.com/questions/12168570/how-to-represent-arrays-within-ember-data-models/13884238#13884238
// Model Usage: DS.attr('array')
// App Usage:   this.get('model.tickers').pushObject('ABC')

export default DS.Transform.extend({

  deserialize: function(serialized) {
    if (Ember.typeOf(serialized) === "array") {
      return serialized;
    } else {
      return [];
    }
  },

  serialize: function(deserialized) {
    var type = Ember.typeOf(deserialized);

    if (type === 'array') {
      return deserialized;
    } else if (type === 'string') {
      return deserialized.split(',').map(function(item) {
        return Ember.$.trim(item);
      });
    } else {
      return [];
    }
  }


});
