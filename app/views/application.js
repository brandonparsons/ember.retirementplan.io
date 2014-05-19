/* global FastClick */

export default Ember.View.extend({

  didInsertElement: function () {
    $(document).ready(function() {
      FastClick.attach(document.body);
    });
  }

});
