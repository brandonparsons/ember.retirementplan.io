import { request as icAjaxRequest } from 'ic-ajax';


// FB.api() function takes a callback, but doesn't have an error argument.
// Therefore we can't denodeify it in its current state....
var nodeifiedFBAPi = function(url, cb) {
  FB.api( url, function(response) { cb(null, response); } );
};


// Turn the FB.api call into a promise-returning function
var FBPromise = Ember.RSVP.denodeify(nodeifiedFBAPi);


var getFacebookLoginDetails = function () {
  if (window.ENV.debug) Ember.debug('Logged in to Facebook. Fetching user details...');

  // Call for user data and picture
  var promises = {
    userData:     FBPromise('/me'),
    userPicture:  FBPromise('/me/picture')
  }

  return new Ember.RSVP.Promise(function(resolve, reject) {

    Ember.RSVP.hash(promises).then(function(results) {

      var returnObject = {
        id:     results.userData.id,
        email:  results.userData.email,
        name:   results.userData.first_name, // + results.userData.last_name
        image:  results.userPicture.data.url
      };

      if (window.ENV.debug) {
        Ember.debug('Successful login for: ' + results.userData.email + '. Response details:');
        Ember.debug(Ember.inspect(returnObject));
      }

      resolve(returnObject);
    });
  });
};


var handleFBLogin = function(accessToken, resolveFunction) {
  getFacebookLoginDetails().then(function(userData) {
    Ember.run(function() {
      resolveFunction({
        accessToken:    accessToken,
        image:          userData.image,
        user_name:      userData.name,
        facebookId:     userData.id, // Not really used
        facebookEmail:  userData.email
      });
    });
  });
};


var FacebookAuthenticator = Ember.SimpleAuth.Authenticators.Base.extend({
  // the custom authenticator that initiates the authentication process with Facebook

  restore: function(properties) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!Ember.isEmpty(properties.accessToken)) {
        resolve(properties);
      } else {
        reject();
      }
    });
  },

  authenticate: function() {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      FB.getLoginStatus(function(fbResponse) {
        if (fbResponse.status === 'connected') {
          handleFBLogin(fbResponse.authResponse.accessToken, resolve);
        } else if (fbResponse.status === 'not_authorized') {
          reject();
        } else {
          FB.login(function(fbResponse) {
            if (fbResponse.authResponse) {
              handleFBLogin(fbResponse.authResponse.accessToken, resolve);
            } else {
              reject();
            }
          });
        }
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


var GooglePlusAuthenticator = Ember.SimpleAuth.Authenticators.Base.extend({
  // the custom authenticator that initiates the authentication process with Google+

  restore: function(properties) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!Ember.isEmpty(properties.access_token)) {
        resolve(properties);
      } else {
        reject();
      }
    });
  },

  authenticate: function() {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      gapi.auth.authorize({
        client_id:        window.ENV.google_client_id,
        scope:            ['https://www.googleapis.com/auth/plus.me'],
        'approvalprompt': 'force',
        immediate:        false
      }, function(authResult) {
        if (authResult && !authResult.error) {
            resolve({ access_token: authResult.access_token });
          } else {
            reject((authResult || {}).error);
          }
      });
    });
  },

  invalidate: function() {
    return Ember.RSVP.resolve();
    // // Issue DELETE to token endpoint to clear auth token prior to signing out
    // // on client side. See:
    // // https://github.com/simplabs/ember-simple-auth/issues/156
    // return icAjaxRequest({
    //   url: this.serverLogoutEndpoint,
    //   type: 'DELETE'
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

    container.register('authenticator:password',  PasswordAuthenticator);
    container.register('authorizer:custom',       CustomAuthorizer);

    container.register('authenticator:facebook',   FacebookAuthenticator);
    container.register('authenticator:googleplus', GooglePlusAuthenticator);

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
