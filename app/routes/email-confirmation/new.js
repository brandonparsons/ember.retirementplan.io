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

    confirmEmail: function() {
      var route       = this;
      var controller  = this.get('controller');
      var email       = controller.get('email');

      icAjaxRequest({
        url:  window.RetirementPlanENV.apiHost + '/email_confirmations',
        type: 'POST',
        data: { email: email }
      }).then( function() {
        RetirementPlan.setFlash('notice', 'Email confirmation instructions have been sent to ' + email);
        route.transitionTo('sign_in');
        controller.send('reset');
      });

    }
  }

});
