import Ember from 'ember';
import Droppable from 'retirement-plan/mixins/droppable';

export default Ember.Component.extend(
  Droppable, {

  dragContext: null, // Bound

  classNameBindings: [':drop-target', 'dropTargetClass'],

  // This will determine which class (if any) you should add to the view when
  // you are in the process of dragging an item, and what help text to display.
  dropAction: function() {
    var dragContext, isAdded;
    dragContext = this.get('dragContext');
    if ( Ember.isEmpty(dragContext) ) { return null; }

    isAdded = dragContext.get('isAdded');
    if (isAdded) {
      return 'drop-remove';
    } else {
      return 'drop-add';
    }
  }.property('dragContext', 'dragContext.isAdded'),

  dropTargetClass: function() {
    var dropAction = this.get('dropAction');
    if (Ember.isEmpty(dropAction)) {
      return null;
    } else if (dropAction === 'drop-add') {
      return 'bg-success drop-add';
    } else if (dropAction === 'drop-remove') {
      return 'bg-danger drop-remove';
    } else {
      // Should not get here....
      throw new Error('Invalid drop action');
    }
  }.property('dropAction'),

  helpText: function() {
    var action = this.get('dropAction');
    if (action === 'drop-add') {
      return '(Drop to Add)';
    } else if (action === 'drop-remove') {
     return '(Drop to Remove)';
    } else {
      return '(Drop Here)';
    }
  }.property('dropAction'),

  drop: function(event) {
    var expenseID = event.originalEvent.dataTransfer.getData("expenseID");

    this._super(event); // Call the droppable action (cancels default)
    this.sendAction('action', expenseID);
  },


});
