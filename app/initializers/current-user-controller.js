export default {
  name:   'current-user-controller',
  after:  'authentication',
  initialize: function(container) {
    // Look up the controller so that it is instantiated
    var currentUserController = container.lookup('controller:user/current');
    currentUserController.get('id'); // ** No-Op to make jsHint happy
    container.typeInjection('controller', 'currentUser', 'controller:user/current');
  }
};
