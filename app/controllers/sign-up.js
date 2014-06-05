var signUpController = Ember.ObjectController.extend(
  Ember.Validations.Mixin, {

  email: null,
  password: null,
  passwordConfirmation: null,

  serialized: function() {
    return {
      email:                  this.get('email'),
      password:               this.get('password'),
      password_confirmation:  this.get('passwordConfirmation')
    };
  }.property('email', 'password', 'passwordConfirmation'),

  actions: {
    reset: function() {
      // Get rid of password properties
      this.set('password', null);
      this.set('passwordConfirmation', null);
    }
  }

});

signUpController.reopen({
  validations: {
    email: {
      presence: true,
      format: {
        message: 'Must be a valid e-mail address',
        allowBlank: false,
        with: /^[^@\s]+@[^@\s]+\.[^@\s]+$/
      }
    },
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

export default signUpController;
