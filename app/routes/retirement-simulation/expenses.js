import Ember from 'ember';

export default Ember.Route.extend({
  model: function() { return this.store.find('expense'); },

  actions: {
    displayExpenseCreateModal: function() {
      var expenseController = this.controllerFor('retirementSimulation/expense');
      expenseController.set('title', 'Create Expense');
      expenseController.set('model', this.store.createRecord('expense'));
      this.send('showSharedModal', 'retirementSimulation/expenseModal', 'retirementSimulation/expense');
    },

    displayExpenseEditModal: function(expense) {
      var expenseController = this.controllerFor('retirementSimulation/expense');
      expenseController.set('title', 'Edit Expense');
      expenseController.set('model', expense);
      this.send('showSharedModal', 'retirementSimulation/expenseModal', 'retirementSimulation/expense');
    }
  }
});
