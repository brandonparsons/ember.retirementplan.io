export default Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin, {
  authenticatorFactory: 'authenticator:password',

  actions: {
    authenticateWithHelloJs: function(provider) {
      this.get('session').authenticate('authenticator:hello', {provider: provider});
    }
  }

});
