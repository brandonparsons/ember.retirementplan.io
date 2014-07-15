import Ember from 'ember';

export default Ember.ArrayController.extend({

  needs: ['user/current'],
  currentUser: Ember.computed.alias('controllers.user/current'),


  ////////////////
  // Properties //
  ////////////////

  sortProperties: ['amount'],
  sortAscending: false,


  /////////////////////////
  // Computed Properties //
  /////////////////////////

  // If they have not clicked through to the `simulation parameters` page, then
  // we have created a bunch of default expenses for them. Need to keep track
  // of this, as we display a little alert box letting the user know that we've
  // created some defaults for them.
  hasSelectedExpenses: Ember.computed.alias('currentUser.hasSelectedExpenses'),

  visible: Ember.computed.filterBy('arrangedContent', 'isNew', false),

  addedExpenses:    Ember.computed.filterBy('visible', 'isAdded', true),
  unAddedExpenses:  Ember.computed.filterBy('visible', 'isAdded', false),

  unAddedOnetime: Ember.computed.filterBy('unAddedExpenses', 'frequency', 'onetime'),
  unAddedAnnual:  Ember.computed.filterBy('unAddedExpenses', 'frequency', 'annual'),
  unAddedMonthly: Ember.computed.filterBy('unAddedExpenses', 'frequency', 'monthly'),
  unAddedWeekly:  Ember.computed.filterBy('unAddedExpenses', 'frequency', 'weekly'),

  addedOnetime: Ember.computed.filterBy('addedExpenses', 'frequency', 'onetime'),
  addedAnnual:  Ember.computed.filterBy('addedExpenses', 'frequency', 'annual'),
  addedMonthly: Ember.computed.filterBy('addedExpenses', 'frequency', 'monthly'),
  addedWeekly:  Ember.computed.filterBy('addedExpenses', 'frequency', 'weekly'),

  currentDragItem: function() {
    return this.findProperty('isDragging', true);
  }.property('@each.isDragging'),


  /////////////
  // ACTIONS //
  /////////////

  actions: {
    expenseDropped: function(expenseId) {
      // Called from drop target component on receipt of drop.
      var expense = this.findProperty('id', expenseId);
      expense.toggleAdded();
      expense.set('isDragging', false);
    }
  }

});
