// Source: http://www.kaspertidemann.com/representing-objects-in-ember-data/
// Model Usage: DS.attr('object')
// App Usage:   this.get('model').set('weights', {happy: 'now', goodbye: 'today'})

export default DS.Transform.extend({

  deserialize: function(serialized) {
    if (Em.none(serialized)) {
      return {};
    } else {
      return serialized;
    }
  },
  serialize: function(deserialized) {
    if (Em.none(deserialized)) {
      return {};
    } else {
      return deserialized;
    }
  }

});
