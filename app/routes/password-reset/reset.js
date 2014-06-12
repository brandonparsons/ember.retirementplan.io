import errorProcessor from 'retirement-plan/utils/error-processor';
import { request as icAjaxRequest } from 'ic-ajax';

export default Ember.Route.extend({
  // This is not a logged-out route, as it's possible a logged-in user might
  // get here if setting their password for the first time (from OAuth).

  deactivate: function() {
    this.get('controller').send('reset');
  },

  model: function(params) {
    return Ember.Object.create({token: params.token});
  },

  actions: {
    cancel: function() {
      this.transitionTo('sign_in');
    },

    resetPassword: function() {
      var route       = this;
      var store       = this.store;
      var controller  = this.get('controller');
      var session     = route.get('session');

      icAjaxRequest({
        url:  ENV.apiHost + '/password_resets/reset',
        type: 'POST',
        data: controller.get('serialized')
      }).then( function() {
        var message;

        if (session.get('isAuthenticated')) {
          message = 'Password has been successfully set.';
          // Reload the current user model so that has_password change gets reflected
          // FIXME: Consider loading direct from user.current controller?
          store.find('user', session.get('user_id')).then( function(user) {
            user.reload();
            route.transitionTo('user.dashboard');
          });
        } else {
          message = 'Password has been successfully changed. Please log in.';
          route.transitionTo('sign_in');
        }
        controller.send('reset');
        RetirementPlan.setFlash('success', message);
      }, function(errorResponse) {
        var errorMessage = errorProcessor(errorResponse) || "Sorry - something went wrong.  Please try again.";
        RetirementPlan.setFlash('error', errorMessage);
      });
    }
  }

});
