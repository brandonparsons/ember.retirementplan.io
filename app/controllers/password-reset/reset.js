var resetPasswordResetController = Ember.ObjectController.extend(
  Ember.Validations.Mixin, {

  password: null,
  passwordConfirmation: null,

  serialized: function() {
    return {
      password_reset_token:   this.get('token'),
      password:               this.get('password'),
      password_confirmation:  this.get('passwordConfirmation')
    };
  }.property('token', 'password', 'passwordConfirmation'),

  actions: {
    reset: function() {
      this.set('password', null);
      this.set('passwordConfirmation', null);
      this.set('token', null);
    }
  }

});

resetPasswordResetController.reopen({
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

export default resetPasswordResetController;
