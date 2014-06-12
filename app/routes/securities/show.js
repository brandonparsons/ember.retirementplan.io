import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.find('security', params.security_id);
  }
});
