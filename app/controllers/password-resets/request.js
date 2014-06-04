var requestPasswordResetController = Ember.ObjectController.extend(
  Ember.Validations.Mixin, {

  password: null,
  passwordConfirmation: null,

  actions: {
    reset: function() {
      this.set('password', null);
      this.set('passwordConfirmation', null);
      this.set('token', null);
    }
  }

});

requestPasswordResetController.reopen({
  validations: {
    password: {
      presence: true,
      length: {minimum: 6},
      confirmation: {message: 'Confirmation must match password'}
    },
    passwordConfirmation: {
      presence: true
    }
  }
});

export default requestPasswordResetController;
