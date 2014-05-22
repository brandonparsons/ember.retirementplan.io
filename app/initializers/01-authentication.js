import { request as icAjaxRequest } from 'ic-ajax';


var HelloAuthenticator = Ember.SimpleAuth.Authenticators.Base.extend({
  // the custom authenticator that initiates the authentication process with Facebook

  restore: function(properties) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!Ember.isEmpty(properties.access_token)) {
        resolve(properties);
      } else {
        reject();
      }
    });
  },

  authenticate: function(controllerData) {
    var provider = controllerData.provider;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      // Starts popup auth flow
      hello(provider).login();

      // Attach event listener for when login completes
      hello.on('auth.login', function(auth) {

        // Get user details
        hello( auth.network ).api( '/me' ).success(function(json){
          if (window.ENV.debug) {
            Ember.debug('Received user data from OAuth endpoint');
            Ember.debug(Ember.inspect(json));
          }

          Ember.run(function() {
            resolve({
              access_token:   auth.authResponse.access_token,
              image:          json.picture,
              user_name:      json.name,
              facebookId:     json.id, // Not really used
              facebookEmail:  json.email
            });
          });

        }).error(function() {
          reject()
        });

      });
    });
  },

  invalidate: function() {
    return Ember.RSVP.resolve();
    // Issue DELETE to token endpoint to clear auth token prior to signing out
    // on client side. See:
    // https://github.com/simplabs/ember-simple-auth/issues/156
    // return icAjaxRequest({
    //   url: this.serverLogoutEndpoint,
    //   type: 'DELETE'
    // });
    // return new Ember.RSVP.Promise(function(resolve, reject) {
    //   FB.logout(function(response) {
    //     Ember.run(resolve);
    //   });
    // });
  }

});



var PasswordAuthenticator = Ember.SimpleAuth.Authenticators.Base.extend({
  // This is essentially the Devise authenticator (with a few tweaks), pulled in
  // to the application as you aren't using Devise.

  serverLoginEndpoint:  ENV.apiHost + '/users/sign_in',
  serverLogoutEndpoint: ENV.apiHost + '/users/sign_out',

  restore: function (properties) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!Ember.isEmpty(properties.user_token) && !Ember.isEmpty(properties.user_email)) {
        resolve(properties);
      } else {
        reject();
      }
    });
  },

  authenticate: function (credentials) {
    var _this = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      icAjaxRequest({
        url:      _this.serverLoginEndpoint,
        type:     'POST',
        dataType: 'json',
        data:     {
          email:    credentials.identification,
          password: credentials.password
        }
      }).then(function(response) {
        Ember.run(function() {
          resolve(response);
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
      url: this.serverLogoutEndpoint,
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
  name: 'authentication',
  initialize: function(container, application) {

    container.register('authenticator:hello',     HelloAuthenticator);
    container.register('authenticator:password',  PasswordAuthenticator);

    container.register('authorizer:custom',       CustomAuthorizer);

    Ember.SimpleAuth.setup(container, application, {
      authorizerFactory: 'authorizer:custom',
      crossOriginWhitelist: [
        'http://api.retirementplan.io',
        'https://api.retirementplan.io',
        'http://localhost:3000',
        'https://localhost:3000'
      ]
      // routeAfterAuthentication: 'dashboard'  // Not required, we over-rode the application route action
    });

  }
};
