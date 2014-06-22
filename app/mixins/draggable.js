import Ember from 'ember';

export default Ember.Mixin.create({
  attributeBindings: ["draggable"],
  draggable: "true",

  // Over-riding this in expense-detail.js
  dragStart: function(event) {
    var dataTransfer = event.originalEvent.dataTransfer;
    dataTransfer.setData("Text", this.get("elementId"));
  }
});
