import errorProcessor from 'retirement-plan/utils/error-processor';
import { request as icAjaxRequest } from 'ic-ajax';


export default Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {

  deactivate: function() {
    this.get('controller').send('reset');
  },

  actions: {
    changePassword: function() {
      var route = this;
      var controller = this.get('controller');

      icAjaxRequest({
        url:  ENV.apiHost + '/users/change_password',
        type: 'POST',
        data: { user: controller.get('serialized') }
      }).then( function() {
        RetirementPlan.setFlash('success', 'Password successfully changed.');
        route.transitionTo('dashboard');
      }, function(errorResponse) {
        var errorMessage = errorProcessor(errorResponse) || "Sorry - something went wrong.  Please try again.";
        RetirementPlan.setFlash('error', errorMessage);
      });

    },

   cancel: function() {
      this.transitionTo('dashboard');
    }
  }
});
