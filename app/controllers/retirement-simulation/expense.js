import Ember from 'ember';

var expenseController = Ember.ObjectController.extend(
  Ember.Validations.Mixin, {

  ////////////////
  // Properties //
  ////////////////

  title: null, // Bound
  showDelete: Ember.computed.not('model.isNew'),

  frequencyOptions: [
    {id: 'weekly', name: 'Weekly'},
    {id: 'monthly', name: 'Monthly'},
    {id: 'annual', name: 'Annual'},
    {id: 'onetime', name: 'One-time'},
  ],


  //////////////////////////
  // Computed Properties //
  /////////////////////////

  onetimeOnValid: function() {
    var date;
    if ( this.get('frequency') === 'onetime' ) {
      date = this.get('onetimeOn');
      if ( !Ember.isEmpty(date) ) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }.property('frequency', 'onetimeOn'),

  formValid: Ember.computed.and('isValid', 'onetimeOnValid'),


  /////////////
  // Actions //
  /////////////

  actions: {

    submitModal: function() {
      var controller = this;
      controller.get('model').save().then( function() {
        controller.send('destroyModal');
        RetirementPlan.setFlash('success', 'Your expense has been saved.');
      });
    },

    destroyModal: function() {
      var model = this.get('model');
      if ( model.get('isDirty') ) {
        model.rollback();
        model.notifyPropertyChange('frequency'); // Rollbacks didn't always put back in the right section
      }
      return true; // We want this to bubble up to the application route
    },

    deleteExpense: function() {
      var model = this.get('model');
      if ( confirm("Are you sure you want to delete this expense?") ) {
        this.send('destroyModal');
        model.deleteRecord();
        model.save().then( function() {
          RetirementPlan.setFlash('success', 'Your expense has been deleted.');
        });
      }
    }
  }

});


/////////////////
// Validations //
/////////////////

expenseController.reopen({
  validations: {
    description: {
      presence: true
    },
    amount: {
      presence: true,
      numericality: {
        greaterThan: 0
      }
    },
    frequency: {
      presence: true,
      inclusion: {
        in: ['weekly', 'monthly', 'annual', 'onetime']
      }
    },
    notes: {},
    isAdded: {
      presence: true,
      inclusion: {
        in: [true, false]
      }
    }
  }
});


export default expenseController;
