var loginController = Ember.Controller.extend(
  Ember.SimpleAuth.LoginControllerMixin,
  Ember.Validations.Mixin, {

  authenticatorFactory: 'authenticator:password'
});


loginController.reopen({

  validations: {
    identification: {
      presence: true,
      format: {
        message: 'Must be a valid e-mail address',
        allowBlank: false,
        with: /^[^@\s]+@[^@\s]+\.[^@\s]+$/
      }
    },
    password: {
      presence: true,
      length: {minimum: 6}
    }
  }

});


export default loginController;
