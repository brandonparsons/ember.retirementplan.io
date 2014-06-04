import errorProcessor from 'retirement-plan/utils/error-processor';
import { request as icAjaxRequest } from 'ic-ajax';


export default Ember.Route.extend(
  Ember.SimpleAuth.AuthenticatedRouteMixin, {

  model: function () {
    // Rails controller will return the current_user no matter what ID we search
    // for, but using the proper session user_id so that ember-data doesn't get
    // confused.
    // Need to load up the actual user so will have access to authentications
    return this.store.find( 'user', this.session.get('user_id') );
  },

  deactivate: function() {
    this.get('controller').send('reset');
  },


  actions: {

    removeAuth: function(auth) {
      var user = this.get('currentModel');
      if (user.get('authenticationCount') > 1 || user.get('hasPassword')) {
        auth.deleteRecord();
        auth.save().then(function() {
          RetirementPlan.setFlash('success', 'Authentication removed.');
        });
      } else {
        RetirementPlan.setFlash('notice', "Can't delete that provider - it's your last one and you haven't set a password.");
      }
    },

    editProfile: function() {
      var route       = this;
      var store       = this.store;
      var controller  = this.get('controller');

      icAjaxRequest({
        url:  ENV.apiHost + '/users/current',
        type: 'PUT',
        data: { user: controller.get('serialized') }
      }).then( function(userData) {
        var newEmail, authStore, currentAuthData;

        // Over-write the user's data in the store
        store.pushPayload('user', userData);

        // Over-write the user email in ember-simple-auth's localStorage data,
        // and the current session.
        newEmail        = userData.user.email;
        authStore       = route.get('session.store');
        currentAuthData = authStore.restore();

        authStore.replace( Ember.$.extend(currentAuthData, { user_email: newEmail }) );
        route.get('session').set('user_email', newEmail);

        RetirementPlan.setFlash('success', 'Your profile has been updated.');
        route.transitionTo('dashboard');
      }, function(errorResponse) {
        var errorMessage = errorProcessor(errorResponse) || "Sorry - something went wrong.  Please try again.";
        RetirementPlan.setFlash('error', errorMessage);
      });

    }, // editProfile

    cancel: function() {
      // Controller reset built-in to `deactivate`
      this.transitionTo('dashboard');
    }

  } // actions

});
