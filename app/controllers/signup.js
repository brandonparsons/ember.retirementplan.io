var signupController = Ember.ObjectController.extend(
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
      // Get rid of password property
      this.set('email', null);
      this.set('password', null);
      this.set('passwordConfirmation', null);
    }
  }

});

signupController.reopen({

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
      confirmation: true
    },
    passwordConfirmation: {
      presence: true
    }
  }

});

export default signupController;
