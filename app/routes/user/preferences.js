import errorProcessor from 'retirement-plan/utils/error-processor';


export default Ember.Route.extend(
  Ember.SimpleAuth.AuthenticatedRouteMixin, {

  model: function() {
    return this.store.find('userPreference').then(function(array) {
      return array.get('firstObject');
    });
  },

  deactivate: function() {
    this.get('currentModel').rollback();
  },


  actions: {

    editPreferences: function() {
      var route = this;
      this.get('currentModel').save().then( function() {
        RetirementPlan.setFlash('success', 'Your preferences have been updated.');
        route.transitionTo('user.dashboard');
      }, function(errorResponse) {
        var errorMessage = errorProcessor(errorResponse) || "Sorry - something went wrong.  Please try again.";
        RetirementPlan.setFlash('error', errorMessage);
      });
    },

    cancel: function() {
      this.transitionTo('user.dashboard');
    }

  }

});
