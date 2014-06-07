/* global hello */

import errorProcessor from 'retirement-plan/utils/error-processor';
import { request as icAjaxRequest } from 'ic-ajax';


var profileController = Ember.ObjectController.extend(
  Ember.Validations.Mixin, {

  currentPassword:      null,
  password:             null,
  passwordConfirmation: null,


  ////////////////////
  // COMPUTED PROPS //
  ////////////////////

  remainingAuthenticationProviders: function() {
    // Returns a list of authentication providers that the user has not yet
    // attached. (e.g. ['google'])

    var controller = this;
    var availableAuthentications = ['google', 'facebook'];

    var promiseArray = DS.PromiseArray.create({
      promise: new Ember.RSVP.Promise(function(resolve) {
        controller.get('authentications').then(function(authentications) {
          var auths = _.reject(availableAuthentications, function(provider) {
            return _.any(authentications.get('content'), function(auth) {
              return auth.get('provider') === provider;
            });
          });
          resolve(auths);
        });
      }) // promise
    }); // promiseArray
    return promiseArray;
  }.property('authentications.@each.provider'),

  serialized: function() {
    return {
      name:                   this.get('name'),
      email:                  this.get('email'),
      current_password:       this.get('currentPassword'),
      password:               this.get('password'),
      password_confirmation:  this.get('passwordConfirmation')
    };
  }.property('name', 'email', 'currentPassword', 'password', 'passwordConfirmation'),

  currentPasswordMissing: Ember.computed.empty('currentPassword'),
  passwordPresent:        Ember.computed.notEmpty('password'),


  /////////////
  // ACTIONS //
  /////////////

  // For some reason, couldn't move #addOAuthProvider out to the route, leaving
  // in the controller. #removeAuth kept in the controller to match.

  actions: {

    addOAuthProvider: function(provider) {
      var controller  = this;
      var store       = this.store;
      var email       = this.get('session.user_email');

      hello.on('auth.login', function(auth) {
        var authData;

        // First thing - clear the handler.
        hello.off('auth.login');

        if (window.ENV.debug) {
          Ember.debug('Received auth data from ' + auth.network  + ' OAuth endpoint');
          window.console.log(auth);
        }

        // Save the auth data before we logout
        authData          = auth.authResponse;
        authData.provider = provider; // Need to note the provider

        hello(provider).logout();

        icAjaxRequest({
          url:  ENV.apiHost + '/authentications',
          type: 'POST',
          data: { user: _.merge(authData, {email: email}) }
        }).then( function(response) {
          store.pushPayload('authentication', response);
          controller.get('model').reload(); // Reload the user to update the hasMany
        }, function(errorResponse) {
          var errorMessage = errorProcessor(errorResponse) || "Sorry - something went wrong.  Please try again.";
          RetirementPlan.setFlash('error', errorMessage);
        });

      }); // hello.on

      hello(provider).login();
    },

    removeAuth: function(auth) {
      if (this.get('authenticationCount') > 1 || this.get('hasPassword')) {
        auth.deleteRecord();
        auth.save().then(function() {
          RetirementPlan.setFlash('success', 'Authentication removed.');
        });
      } else {
        RetirementPlan.setFlash('notice', "Can't delete that provider - it's your last one and you haven't set a password.");
      }
    },

    reset: function() {
      this.set('currentPassword', null);
      this.set('password', null);
      this.set('passwordConfirmation', null);
      this.get('model').rollback();
    }

  }

});


profileController.reopen({

  validations: {
    name: {
      presence: true,
      length: {minimum: 2}
    },
    email: {
      presence: true,
      format: {
        message: 'Must be a valid e-mail address',
        allowBlank: false,
        with: /^[^@\s]+@[^@\s]+\.[^@\s]+$/
      }
    },
    currentPassword: {
      presence: true,
      length: {
        minimum: 6
      }
    },
    password: {
      length: {
        if: 'passwordPresent',
        minimum: 6
      },
      confirmation: {
        if: 'passwordPresent',
        message: 'Confirmation must match password'
      }
    },
  }

});

export default profileController;
