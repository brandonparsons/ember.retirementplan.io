import Ember from 'ember';
import Draggable from 'retirement-plan/mixins/draggable';

export default Ember.Component.extend(
  Draggable, {

  ////////////////
  // Properties //
  ////////////////

  expense: null, // Bound
  tagName: 'span',

  displayingMoreDetails: false,

  frequencyForDisplay: function() {
    var frequency = this.get('expense.frequency');
    if (frequency === 'onetime') {
      return 'one-time';
    } else {
      return frequency;
    }
  }.property('expense.frequency'),


  ////////////
  // Events //
  ////////////

  dragStart: function(event) {
    // Not calling this._super(event). We are not going to bother setting the
    // `Text` property on the drag action - just set expenseID.
    var dataTransfer, $el;

    dataTransfer = event.originalEvent.dataTransfer;

    // Over-ride the mixin's dragStart logic to capture the actual expense ID
    dataTransfer.setData( 'expenseID', this.get('expense.id') );

    // Let the controller know this view is dragging
    this._toggleDragging();

    // Set the drag image and location relative to the mouse/touch event
    // If you simply set the image to event.target, it doesn't seem to work right
    // after the HTML element has been expanded/contracted
    $el = this.$( "#expense-" + this.get('expense.id') );
    dataTransfer.setDragImage($el[0], 50, 50);
  },

  dragEnd: function() {
    // Let the controller know this view is done dragging
    this._toggleDragging();
  },

  doubleClick: function() {
    this._toggleAddedExpense();
  },


  ///////////////
  // Functions //
  ///////////////

  _toggleDragging: function() {
    this.get('expense').toggleDragging();
  },

  _toggleAddedExpense: function() {
    this.get('expense').toggleAdded();
  },


  /////////////
  // Actions //
  /////////////

  actions: {
    more: function() {
      this.toggleProperty('displayingMoreDetails');
    },

    editExpense: function() {
      this.sendAction( 'action', this.get('expense') );
    },
  },

});
