import errorProcessor from 'retirement-plan/utils/error-processor';
import { request as icAjaxRequest } from 'ic-ajax';

export default Ember.Route.extend({

  model: function(params) {
    return Ember.Object.create({token: params.token});
  },

  afterModel: function(model) {
    var route = this;
    var token = model.get('token');

    icAjaxRequest({
      url:  ENV.apiHost + '/email_confirmations/confirm',
      type: 'POST',
      data: {email_confirmation_token: token}
    }).then( function(response) {
      var newEmail, store, authStore, currentAuthData;
      var session = route.get('session');

      if (session.get('isAuthenticated')) {
        newEmail = response.updated_email;
        if (newEmail) {
          // The user's email on the server has been updated, but the current
          // session and data-store still have the old email. We need to update
          // the session, and ember-data's info.
          store           = route.store;
          authStore       = session.get('store');
          currentAuthData = authStore.restore();

          // Replace the session data, and session-store data (localStorage)
          authStore.replace( Ember.$.extend(currentAuthData, { user_email: newEmail }) );
          route.get('session').set('user_email', newEmail);

          // Reload the current user model so that confirmation gets reflected
          store.find('user', session.get('user_id')).then( function(user) {
            user.reload(); // The original find will just return from the cache.
          });
        }
        route.transitionTo('user.dashboard');
      } else {
        route.transitionTo('sign_in');
      }

      RetirementPlan.setFlash('success', response.message);
    }, function(errorResponse) {
      var errorMessage = errorProcessor(errorResponse) || "Sorry - something went wrong.  Please try again.";
      route.transitionTo('user.dashboard');
      RetirementPlan.setFlash('error', errorMessage);
    });

  }

});
