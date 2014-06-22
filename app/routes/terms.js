import Ember from 'ember';
import { request as icAjaxRequest } from 'ic-ajax';

export default Ember.Route.extend(
  Ember.SimpleAuth.AuthenticatedRouteMixin, {

  actions: {
    acceptTerms: function() {
      var route   = this;
      icAjaxRequest({
        url:  window.RetirementPlanENV.apiHost + '/users/accept_terms',
        type: 'POST'
      }).then( function() {
        // Reload the current user model so that confirmation gets reflected
        var user = route.controllerFor('user.current').get('model');
        user.reload();
        route.transitionTo('user.dashboard');
      });
    }
  }

});
