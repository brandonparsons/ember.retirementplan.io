var changePasswordController = Ember.Controller.extend(Ember.Validations.Mixin, {

  currentPassword:      null,
  password:             null,
  passwordConfirmation: null,

  serialized: function() {
    return {
      current_password:       this.get('currentPassword'),
      password:               this.get('password'),
      password_confirmation:  this.get('passwordConfirmation')
    };
  }.property('currentPassword', 'password', 'passwordConfirmation'),

  currentPasswordMissing: Ember.computed.not('currentPassword'),


  actions: {
    reset: function() {
      // Get rid of password properties
      this.set('currentPassword', null);
      this.set('password', null);
      this.set('passwordConfirmation', null);
    }
  }

});

changePasswordController.reopen({

  validations: {
    currentPassword: {
      presence: true
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

export default changePasswordController;
