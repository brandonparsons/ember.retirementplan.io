var Router = Ember.Router.extend({
  location: ENV.locationType
});

Router.map(function() {

  this.route('login');

  this.route('help');

  this.route('profile')

  this.route('dashboard');

  this.resource('securities', function() {
    this.route('show', {path: ':security_id'});
  });

});

export default Router;
