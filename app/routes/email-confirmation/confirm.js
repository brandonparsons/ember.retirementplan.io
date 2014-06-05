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
      var store   = route.store;
      var session = route.get('session');
      if (session.get('isAuthenticated')) {
        // Reload the current user model so that confirmation gets reflected
        store.find('user', session.get('user_id')).then( function(user) {
          user.reload();
        });
      }
      route.transitionTo('user.dashboard');
      RetirementPlan.setFlash('success', response.message);
    }, function(errorResponse) {
      var errorMessage = errorProcessor(errorResponse) || "Sorry - something went wrong.  Please try again.";
      route.transitionTo('user.dashboard');
      RetirementPlan.setFlash('error', errorMessage);
    });

  }

});
