import SignedOutRoute from 'retirement-plan/mixins/signed-out-route';


export default Ember.Route.extend(
  SignedOutRoute, {

  actions: {
    authenticateWithHelloJs: function(provider) {
      var session = this.get('session');

      session.authenticate('authenticator:hello', {provider: provider}).then( function() {
        var email = session.get('user_email');
        RetirementPlan.setFlash('success', 'Welcome! Signed in as ' + email);
      });
    }
  }

});
