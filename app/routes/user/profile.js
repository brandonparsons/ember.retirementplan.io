import Ember from 'ember';
import errorProcessor from 'retirement-plan/utils/error-processor';
import { request as icAjaxRequest } from 'ic-ajax';

export default Ember.Route.extend({

  model: function() {
    // Rails controller will return the current_user no matter what ID we search
    // for, but using the proper session user_id so that ember-data doesn't get
    // confused.
    // Need to load up the actual user so will have access to authentications.
    return this.store.find( 'user', this.session.get('user_id') );
  },

  deactivate: function() {
    this.get('controller').send('reset');
  },


  actions: {

    editProfile: function() {
      var route       = this;
      var store       = this.store;
      var controller  = this.get('controller');

      icAjaxRequest({
        url:  window.RetirementPlanENV.apiHost + '/users/current',
        type: 'PUT',
        data: { user: controller.get('serialized') }
      }).then( function(userData) {
        var messageType, message, sticky;

        // Pull out the unconfirmed email to determine if this was an original
        // email confirmation, or an email change confirmation.
        var unconfirmedEmail = userData.unconfirmed_email;
        if (unconfirmedEmail) {
          messageType = 'notice';
          message     = 'Your email change requires confirmation (other changes have been applied). We have sent instructions to your new address - ' + unconfirmedEmail + '.';
          sticky      = 10000;
          delete(userData.unconfirmed_email); // This will still be there, even if null
        } else {
          messageType = 'success';
          message     = 'Your profile has been updated.';
          sticky      = false;
        }

        // Over-write the user's data in the store. We aren't changing their
        // email here, so no need to update the session.
        store.pushPayload('user', userData);

        RetirementPlan.setFlash(messageType, message, sticky);
        route.transitionTo('user.dashboard');
      }, function(errorResponse) {
        var errorMessage = errorProcessor(errorResponse) || "Sorry - something went wrong.  Please try again.";
        RetirementPlan.setFlash('error', errorMessage);
      });

    },

    setPasswordOnOauthAccount: function() {
      icAjaxRequest({
        url:  window.RetirementPlanENV.apiHost + '/users/create_password',
        type: 'POST'
      }).then( function(response) {
        RetirementPlan.setFlash('notice', response.message, 10000);
      }, function(errorResponse) {
        var errorMessage = errorProcessor(errorResponse) || "Sorry - something went wrong.  Please try again.";
        RetirementPlan.setFlash('error', errorMessage);
      });
    }

  }

});
