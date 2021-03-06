/* global hello */

import Ember from 'ember';
import { request as icAjaxRequest } from 'ic-ajax';
import trackEvent from 'retirement-plan/utils/track-event';
import setUpGoogleAnalyticsUserID from 'retirement-plan/utils/set-analytics-user-id';

/*
The frontend rails app can log a user in via modal and fakes the ember-simple-auth
login process by setting localStorage keys. Therefore that login logic depends
on the format of localStorage keys not changing. If ember-simple-auth keys change,
or you use a different session library, be careful. Dependent on:
  - LocalStorage key names
  - Authenticator types "password" and "hello"
  - Redirect location (currently set to /app/users/dashboard)
*/

var serverLoginEndpoint       = window.RetirementPlanENV.apiHost + '/session';
var serverLogoutEndpoint      = window.RetirementPlanENV.apiHost + '/session';
var serverCheckOauthEndpoint  = window.RetirementPlanENV.apiHost + '/session/check_oauth';


var HelloAuthenticator = Ember.SimpleAuth.Authenticators.Base.extend({
  // A generic authenticator that will register with the appropriate service,
  // using hello.js

  sessionStorageIsValid: function(savedStorageProperties) {
    // The helloJS authenticator can use saved values if there is still a
    // user_token and user_email saved.
    return  !Ember.isEmpty(savedStorageProperties.user_token) &&
            !Ember.isEmpty(savedStorageProperties.user_email);
  },

  extractUserProperties: function(jsonData) {
    return {
      uid:    jsonData.id,
      name:   jsonData.name,
      email:  jsonData.email,
      image:  jsonData.picture || jsonData.thumbnail,
    };
  },

  confirmUserIdentity: function(userData) {
    return icAjaxRequest({
      url:  serverCheckOauthEndpoint,
      type: 'POST',
      data: { user: userData }
    });
  },

  restore: function(savedStorageProperties) {
    var _this = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      if ( _this.sessionStorageIsValid(savedStorageProperties) ) {
        setUpGoogleAnalyticsUserID(savedStorageProperties.user_id);
        resolve(savedStorageProperties);
      } else {
        reject();
      }
    });
  },

  authenticate: function(controllerData) {
    var _this     = this;
    var provider  = controllerData.provider;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      var scope;

      // Starts popup auth flow.  Not using the event listener version, as then
      // it will try to check_oauth every time you log in to a 3rd party.
      if (provider === 'facebook') {
        scope = {scope: "public_profile, email"};
      } else if (provider === 'google') {
        scope = {scope: "openid profile email"};
      } else {
        scope = { scope: "default" };
      }

      hello(provider).login(scope, function(auth) {
        var access_token = auth.authResponse.access_token;

        // Get user details
        hello( auth.network ).api( '/me' ).success( function(json) {
          if (window.RetirementPlanENV.debug) {
            Ember.debug('Received user data from ' + auth.network  + ' OAuth endpoint');
            Ember.debug(Ember.inspect(json));
          }

          var userData          = _this.extractUserProperties(json);
          userData.access_token = access_token;
          userData.provider     = provider;

          _this.confirmUserIdentity(userData).then( function(serverUserData) {
            // Hello.js will automatically try to login if there data in
            // localstorage. This is not the behaviour we want. The
            // ember-simple-auth localStorage data will be single source of
            // truth for logged-in state.
            window.localStorage.removeItem("hello");

            setUpGoogleAnalyticsUserID(serverUserData.user_id);
            if (serverUserData.is_new_user) {
              trackEvent('conversion', 'signup');
            }

            resolve(serverUserData);
          }, function(error) {
            // Error confirming the user's identity
            reject(error);
          });
        }).error(function() {
          // hello.js api error
          reject({
            message: 'There was an error connecting to your selected third-party service. Please try again later.'
          });
        }); // .api('/me')
      }); // (provider).login
    }); // Ember.RSVP
  },

  invalidate: function() {  // First argument would be the session object
    return new Ember.RSVP.Promise(function(resolve, reject) {

      // Wait for the hello.js data to be cleared before we tell ember-simple-auth
      // we are good to go.
      hello.on('auth.logout', function() {
        resolve();
      });

      // Issue DELETE to token endpoint to clear auth token prior to signing out
      // on client side. See:
      // https://github.com/simplabs/ember-simple-auth/issues/156
      icAjaxRequest({
        url:      serverLogoutEndpoint,
        type:     'DELETE'
      }).then(function() {
        hello.logout();
      }, function(error) {
        reject(error);
      });
    });
  }

});


var PasswordAuthenticator = Ember.SimpleAuth.Authenticators.Base.extend({
  // This is essentially the Devise authenticator (with a few tweaks), pulled in
  // to the application as you aren't using Devise.

  sessionStorageIsValid: function(savedStorageProperties) {
    // The password authenticator can use saved values if there is still a
    // user_token and user_email saved.
    return  !Ember.isEmpty(savedStorageProperties.user_token) &&
            !Ember.isEmpty(savedStorageProperties.user_email);
  },

  restore: function (savedStorageProperties) {
    var _this = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      if ( _this.sessionStorageIsValid(savedStorageProperties) ) {
        setUpGoogleAnalyticsUserID(savedStorageProperties.user_id);
        resolve(savedStorageProperties);
      } else {
        reject();
      }
    });
  },

  authenticate: function (credentials) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      icAjaxRequest({
        url:      serverLoginEndpoint,
        type:     'POST',
        dataType: 'json',
        data:     {
          email:    credentials.identification,
          password: credentials.password
        }
      }).then(function(serverUserData) {
        Ember.run(function() {
          setUpGoogleAnalyticsUserID(serverUserData.user_id);
          resolve(serverUserData);
        });
      }, function(error) {
        Ember.run(function() {
          reject(error);
        });
      });
    });
  },


  invalidate: function () {
    // Issue DELETE to token endpoint to clear auth token prior to signing out
    // on client side. See:
    // https://github.com/simplabs/ember-simple-auth/issues/156
    return icAjaxRequest({
      url:  serverLogoutEndpoint,
      type: 'DELETE'
    });
  }

}); // PasswordAuthenticator


var CustomAuthorizer = Ember.SimpleAuth.Authorizers.Base.extend({
  // This is essentially the Devise authorizer (with a few tweaks), pulled in
  // to the application as you aren't using Devise.

  authorize: function(jqXHR, requestOptions) {
    var userToken = this.get('session.user_token');
    var userEmail = this.get('session.user_email');

    if (this.get('session.isAuthenticated') && !Ember.isEmpty(userToken) && !Ember.isEmpty(userEmail)) {
      if (!Ember.SimpleAuth.Utils.isSecureUrl(requestOptions.url)) {
        Ember.Logger.warn('Credentials are transmitted via an insecure connection - use HTTPS to keep them secure.');
      }
      jqXHR.setRequestHeader('X-Auth-Email', userEmail);
      jqXHR.setRequestHeader('X-Auth-Token', userToken);
    }
  }

}); // CustomAuthorizer


export default {
  name:     'authentication',
  initialize: function(container, application) {

    container.register('authenticator:hello',     HelloAuthenticator);
    container.register('authenticator:password',  PasswordAuthenticator);

    container.register('authorizer:custom',       CustomAuthorizer);

    Ember.SimpleAuth.setup(container, application, {
      authorizerFactory: 'authorizer:custom',
      // Not needed anymore with the change to /api
      // CORS for now - do need!
      crossOriginWhitelist: [
        'http://api.retirementplan.io',
        'https://api.retirementplan.io',
        'http://localhost:3000',
        'https://localhost:3000',
        'http://rp-rails.dev'
      ],
      authenticationRoute: 'sign_in'
    });

  }
};
