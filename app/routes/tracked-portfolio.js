import Ember from 'ember';

export default Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {

  model: function() {
    // Load up the assets & etfs before allowing the transitions to proceed

    var store             = this.store;
    var assetsController  = this.controllerFor('assets');
    var etfsController    = this.controllerFor('etfs');

    return new Ember.RSVP.Promise(function(resolve) {
      Ember.RSVP.hash({
        assets:   store.find('asset'),
        etfs:     store.find('etf'),
      })
      .then( function(promises) {
        assetsController.set('model', promises.assets);
        etfsController.set('model', promises.etfs);
        resolve();
      });
    });
  },

});
