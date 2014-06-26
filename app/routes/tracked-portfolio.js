import Ember from 'ember';

export default Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {

  model: function() {
    // Load up the securities & etfs before allowing the transitions to proceed

    var store                 = this.store;
    var securitiesController  = this.controllerFor('securities');
    var etfsController        = this.controllerFor('etfs');

    return new Ember.RSVP.Promise(function(resolve) {
      Ember.RSVP.hash({
        securities:   store.find('security'),
        etfs:         store.find('etf'),
      })
      .then( function(promises) {
        securitiesController.set('model', promises.securities);
        etfsController.set('model', promises.etfs);
        resolve();
      });
    });
  }

});
