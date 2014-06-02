/* global hello */

import { request as icAjaxRequest } from 'ic-ajax';


var profileController = Ember.ObjectController.extend(
  Ember.Validations.Mixin, {

  ////////////////////
  // COMPUTED PROPS //
  ////////////////////

  // Returns a list of authentication providers that the user has not yet
  // attached. (e.g. ['google'])
  remainingAuthenticationProviders: function() {
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
      })
    });

    return promiseArray;
  }.property('authentications.@each.provider'),


  /////////////
  // ACTIONS //
  /////////////

  actions: {

    // This likes to live in the controller - doesn't quite function right on
    // the route.
    addOAuthProvider: function(provider) {
      var store = this.store;

      hello.on('auth.login', function(auth) {

        // First thing - clear the handler.
        hello.off('auth.login');

        if (window.ENV.debug) {
          Ember.debug('Received auth data from ' + auth.network  + ' OAuth endpoint');
          Ember.debug(Ember.inspect(auth));
        }

        // Save the auth data before we logout
        var authData = auth.authResponse;
        authData.provider = provider; // Need to note the provider

        hello(provider).logout();

        icAjaxRequest({
          url:  ENV.apiHost + '/authentications',
          type: 'POST',
          data: { user: authData }
        }).then( function(response) {
          store.pushPayload('authentication', response);
        });

      }); // hello.on

      hello(provider).login();
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
    }
  }

});

export default profileController;
