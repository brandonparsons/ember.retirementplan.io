export default Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
  model: function(params) {
    return this.store.find('security', params.security_id);
  }
});
