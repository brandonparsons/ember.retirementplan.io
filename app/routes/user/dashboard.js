import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    // Check that the user does not need to confirm their email before we
    // proceed any further. (This is the default route after a login).
    var confirmed = this.controllerFor('user.current').get('confirmed');
    if (!confirmed) {
      // Clear the session (log the user out) similar to the error handler. We
      // aren't technically checking for confirmation *BEFORE* the user visits
      // most routes, so save them heartache and force the issue.
      this.controllerFor('application').get('session').clear();

      RetirementPlan.setFlash('notice', "You must confirm your email before proceeding.");
      this.transitionTo('email_confirmation');
    }
  }
});
