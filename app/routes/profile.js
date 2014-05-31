import errorProcessor from 'retirement-plan/utils/error-processor';

export default Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {

  model: function () {
    // Rails controller will return the current_user no matter what ID we search
    // for, but using the proper session user_id so that ember-data doesn't get
    // confused.
    return this.store.find( 'user', this.session.get('user_id') );
  },

  deactivate: function () {
    this.get('controller.model').rollback();
  },


  actions: {

    removeAuth: function(auth) {
      auth.deleteRecord();
      auth.save().then(function() {
        RetirementPlan.setFlash('success', 'Authentication removed.');
      });
    },

    editProfile: function() {
      var user  = this.modelFor('profile');
      var self  = this;

      if (!user.get('isDirty')) {
        RetirementPlan.setFlash("notice", "You haven't made any changes.");
      } else {
        user.save().then( function(user) {
          var newEmail, authStore, currentAuthData;

          // Over-write the user email in ember-simple-auth's localStorage data,
          // and the current session.
          newEmail        = user.get('email');
          authStore       = RetirementPlan.__container__.lookup('ember-simple-auth-session-store:local-storage');
          currentAuthData = authStore.restore();

          authStore.replace( Ember.$.extend(currentAuthData, { user_email: newEmail }) );
          self.get('session').set('user_email', newEmail);

          // Go back to the dashboard
          self.transitionTo('dashboard');
          RetirementPlan.setFlash('success', 'Your profile has been updated.');

        }, function(errorResponse) {
          var errorMessage = errorProcessor(errorResponse) || "Sorry - something went wrong when saving your changes.";
          RetirementPlan.setFlash('error', errorMessage);
        });
      }
    } // editProfile

  } // actions

});
