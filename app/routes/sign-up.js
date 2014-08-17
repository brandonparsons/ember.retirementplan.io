import Ember from 'ember';
import SignedOutRoute from 'retirement-plan/mixins/signed-out-route';
import { request as icAjaxRequest } from 'ic-ajax';
import trackEvent from 'retirement-plan/utils/track-event';

export default Ember.Route.extend(
  SignedOutRoute, {

  deactivate: function() {
    this.get('controller').send('reset');
  },

  actions: {

    authenticateWithHelloJs: function(provider) {
      this.get('session').authenticate('authenticator:hello', {provider: provider});
    },

    createUser: function() {
      var store       = this.store;
      var controller  = this.get('controller');
      var session     = this.get('session');

      icAjaxRequest({
        url:  window.RetirementPlanENV.apiHost + '/users',
        type: 'POST',
        data: { user: controller.get('serialized') }
      }).then( function(userData) {
        trackEvent('conversion', 'signup');

        // Push the user into the store to avoid another HTTP request.
        store.pushPayload('user', userData);

        // Now with the user in the store, log in.
        session.authenticate('authenticator:password', {
          identification: controller.get('email'),
          password:       controller.get('password')
        });
      });
    }

  }

});
