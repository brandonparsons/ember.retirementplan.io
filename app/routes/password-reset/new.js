import Ember from 'ember';
import { request as icAjaxRequest } from 'ic-ajax';

export default Ember.Route.extend({
  deactivate: function() {
    this.get('controller').send('reset');
  },

  actions: {
    cancel: function() {
      this.transitionTo('sign_in');
    },

    resetPassword: function() {
      var route       = this;
      var controller  = this.get('controller');
      var email       = controller.get('email');

      icAjaxRequest({
        url:  window.RetirementPlanENV.apiHost + '/password_resets',
        type: 'POST',
        data: { email: email }
      }).then( function() {
        RetirementPlan.setFlash('notice', 'Password reset instructions have been sent to ' + email);
        route.transitionTo('sign_in');
        controller.send('reset');
      });

    }
  }

});
