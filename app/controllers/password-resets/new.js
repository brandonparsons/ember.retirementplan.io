var newPasswordResetController = Ember.ObjectController.extend(
  Ember.Validations.Mixin, {

  email: null,

  actions: {
    reset: function() {
      this.set('email', null);
    }
  }

});

newPasswordResetController.reopen({
  validations: {
    email: {
      presence: true,
      format: {
        message: 'Must be a valid e-mail address',
        allowBlank: false,
        with: /^[^@\s]+@[^@\s]+\.[^@\s]+$/
      }
    }
  }
});

export default newPasswordResetController;
