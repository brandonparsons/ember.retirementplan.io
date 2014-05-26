import { request as icAjaxRequest } from 'ic-ajax';

export default Ember.Controller.extend({

  actions: {

    addOAuthProvider: function(provider) {
      return new Ember.RSVP.Promise(function(resolve, reject) {

        hello.on('auth.login', function(auth) {

          // First thing - clear the handler.
          hello.off('auth.login');

          if (window.ENV.debug) {
            Ember.debug('Received auth data from ' + auth.network  + ' OAuth endpoint');
            Ember.debug(Ember.inspect(auth));
          }

          // Save the auth data before we logout
          var authData = auth.authResponse;

          // Provider is required
          authData.provider = provider

          hello(provider).logout();

          icAjaxRequest({
            url:  ENV.apiHost + '/users/add_oauth',
            type: 'POST',
            data: { user: authData }
          }).then( function(response) {
            resolve(response);
          });

        }); // hello.on

        hello(provider).login();

      }); // Ember.RSVP
    }

  } // actions

});
