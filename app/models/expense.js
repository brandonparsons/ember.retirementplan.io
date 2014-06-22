/* global moment */

import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({

  // Saved properties
  description:  DS.attr('string'),
  amount:       DS.attr('number'),
  frequency:    DS.attr('string'), // weekly, monthly, annual, onetime
  ends:         DS.attr('number'), // This is a date, but handling ourselves
  onetimeOn:    DS.attr('number', { defaultValue: null }), // This is a date, but handling ourselves
  notes:        DS.attr('string', { defaultValue: "" }),
  isAdded:      DS.attr('boolean', { defaultValue: false }),

  // Non-persisted properties
  isDragging: false,


  /////////////////////////
  // Computed Properties //
  /////////////////////////

  isOnetime: Ember.computed.equal('frequency', 'onetime'),

  endsMoment: function(key, value) {
    var ends;
    if ( Ember.isEmpty(value) ) { // Getter
      ends = this.get('ends');
      if ( Ember.isEmpty(ends) ) {
        return null;
      } else {
        return moment(ends, 'X').format('MMM-D-YYYY');
      }
    } else { // Setter
      // If we return a value from the setter, it will be cached as the value.
      ends = moment(value, 'MMM-D-YYYY');
      this.set('ends', window.parseInt(ends.format('X')) );
      return value;
    }
  }.property('ends'),

  onetimeOnMoment: function(key, value) {
    var onetimeOn;
    if ( Ember.isEmpty(value) ) { // Getter
      onetimeOn = this.get('onetimeOn');
      if (Ember.isEmpty(onetimeOn)) {
        return null;
      } else {
        return moment(onetimeOn, 'X').format('MMM-D-YYYY');
      }
    } else { // Setter
      // If we return a value from the setter, it will be cached as the value.
      onetimeOn = moment(value, 'MMM-D-YYYY');
      this.set('onetimeOn', window.parseInt(onetimeOn.format('X')) );
      return value;
    }
  }.property('onetimeOn'),


  ///////////////
  // Functions //
  ///////////////

  toggleAdded: function() {
    this.toggleProperty('isAdded');
    this.save();
  },

  toggleDragging: function() {
    this.toggleProperty('isDragging');
  },

});
