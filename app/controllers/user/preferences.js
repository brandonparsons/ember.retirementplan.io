var preferencesController = Ember.ObjectController.extend(Ember.Validations.Mixin, {

  maxContactFrequencyDays: function(key, value) {
    // If value is set, they have updated the output of this in the form. Set
    // the model.
    if (value) {
     this.set('maxContactFrequency', value * 86400);
    } else {
      return this.get('maxContactFrequency') / 86400.0;
    }
  }.property('maxContactFrequency'),

  minRebalanceSpacingDays: function(key, value) {
    // If value is set, they have updated the output of this in the form. Set
    // the model.
    if (value) {
     this.set('minRebalanceSpacing', value * 86400);
    } else {
      return this.get('minRebalanceSpacing') / 86400.0;
    }
  }.property('minRebalanceSpacing'),


  rangeForAllowableDrift:   [1, 10],
  spinAllowableDriftUp:     false,
  spinAllowableDriftDown:   false,

  rangeForContactFrequency: [1, 30],
  spinContactFrequencyUp:   false,
  spinContactFrequencyDown: false,

  rangeForRebalanceSpacing:   [7, 180],
  spinRebalanceSpacingUp:     false,
  spinRebalanceSpacingDown:   false,

  actions: {
    spin: function(target, direction) {
     this.set('spin' + target + (direction === 'up' ? 'Up' : 'Down'), true);
    }
  }

});

preferencesController.reopen({

  validations: {
    allowableDrift: {
      presence: true,
      numericality: {
        onlyInteger: true,
        greaterThan: 0,
        lessThanOrEqualTo: 10
      }
    },
    maxContactFrequencyDays: {
      presence: true,
      numericality: {
        onlyInteger: true,
        greaterThan: 0,
        lessThanOrEqualTo: 182
      }
    },
    minRebalanceSpacingDays: {
      presence: true,
      numericality: {
        onlyInteger: true,
        greaterThan: 0,
        lessThanOrEqualTo: 365
      }
    }
  }

});

export default preferencesController;
