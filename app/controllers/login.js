export default Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin, {
  authenticatorFactory: 'authenticator:password',

  actions: {
    // // action to trigger authentication with Facebook
    // authenticateWithFacebook: function() {
    //   this.get('session').authenticate('authenticator:facebook', {});
    // },
    // // action to trigger authentication with Google+
    // authenticateWithGooglePlus: function() {
    //   this.get('session').authenticate('authenticator:googleplus', {});
    // }

    authenticateWithHelloJs: function(provider) {
      this.get('session').authenticate('authenticator:hello', {provider: provider});
    }

  }

});
