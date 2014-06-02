import errorProcessor from 'retirement-plan/utils/error-processor';
import SignedOutRoute from 'retirement-plan/mixins/signed-out-route';
import { request as icAjaxRequest } from 'ic-ajax';


export default Ember.Route.extend(
  SignedOutRoute, {

  deactivate: function() {
    this.get('controller').send('reset');
  },

  actions: {

    authenticateWithHelloJs: function(provider) {
      this.get('session').authenticate('authenticator:hello', {
        provider: provider
      }).then( function() {
        RetirementPlan.setFlash('success', 'Welcome! Account created.');
      });
    },

    createUser: function() {
      var store       = this.store;
      var controller  = this.get('controller');
      var session     = this.get('session');

      icAjaxRequest({
        url:  ENV.apiHost + '/users',
        type: 'POST',
        data: { user: controller.get('serialized') }
      }).then( function(userData) {
        // Push the user into the store to avoid another HTTP request.
        store.pushPayload('user', userData);
        // Now with the user in the store, log in.
        session.authenticate('authenticator:password', {
          identification: controller.get('email'),
          password:       controller.get('password')
        }).then( function() {
          RetirementPlan.setFlash('success', 'Welcome! Account created.');
        });
      }, function(errorResponse) {
        var errorMessage = errorProcessor(errorResponse) || "Sorry - something went wrong when saving your changes.";
        RetirementPlan.setFlash('error', errorMessage);
      });
    }

  }

});
