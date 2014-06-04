import errorProcessor from 'retirement-plan/utils/error-processor';
import { request as icAjaxRequest } from 'ic-ajax';

export default Ember.Route.extend({
  deactivate: function() {
    this.get('controller').send('reset');
  },

  model: function(params) {
    return Ember.Object.create({
      token: params.token
    });
  },

  actions: {
    cancel: function() {
      this.transitionTo('sign_in');
    },

    resetPassword: function() {
      var route       = this;
      var controller  = this.get('controller');

      icAjaxRequest({
        url:  ENV.apiHost + '/users/password_resets/request',
        type: 'POST',
        data: {
          password_reset_token: controller.get('token'),
          password: controller.get('password'),
          password_confirmation: controller.get('passwordConfirmation')
        }
      }).then( function() {
        RetirementPlan.setFlash('success', 'Password has been successfully changed. Please log in.');
        route.transitionTo('sign_in');
        controller.send('reset');
      }, function(errorResponse) {
        var errorMessage = errorProcessor(errorResponse) || "Sorry - something went wrong.  Please try again.";
        RetirementPlan.setFlash('error', errorMessage);
      });
    }
  }

});
