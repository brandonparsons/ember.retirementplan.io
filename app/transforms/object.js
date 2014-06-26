import Ember from 'ember';
import DS from 'ember-data';

// Source: http://www.kaspertidemann.com/representing-objects-in-ember-data/
// Model Usage: DS.attr('object')
// App Usage:   this.get('model').set('weights', {happy: 'now', goodbye: 'today'})

export default DS.Transform.extend({

  deserialize: function(serialized) {
    if (Ember.isNone(serialized)) {
      return {};
    } else {
      return serialized;
    }
  },
  serialize: function(deserialized) {
    if (Ember.isNone(deserialized)) {
      return {};
    } else {
      return deserialized;
    }
  }

});
