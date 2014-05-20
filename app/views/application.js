/* global FastClick */

export default Ember.View.extend({

  didInsertElement: function () {
    $(document).ready(function() {

      // Bind FastClick to all elements
      FastClick.attach(document.body);

      // You set up CSS to drop down buttons on hover on desktops. This ensures
      // that clicks on the root element will still work, if in fact it is an
      // anchor.
      $('.dropdown-toggle').click(function() {
        var location = $(this).attr('href');
        if (location != null) {
          window.location.href = location;
          return false;
        } else {
          return true;
        }
      });

    });
  }

});
