import Ember from 'ember';

var cancel = function(event) {
  event.preventDefault();
  return false;
};

export default Ember.Mixin.create({
  dragEnter: cancel,
  dragOver: cancel,
  drop: cancel
});
