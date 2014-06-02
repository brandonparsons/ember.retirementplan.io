import SignedOutRoute from 'retirement-plan/mixins/signed-out-route';


export default Ember.Route.extend(
  SignedOutRoute, {

  actions: {
    authenticateWithHelloJs: function(provider) {
      this.get('session').authenticate('authenticator:hello', {provider: provider});
    }
  }

});
