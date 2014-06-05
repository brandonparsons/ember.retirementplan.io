var Router = Ember.Router.extend({
  location: ENV.locationType
});

Router.map(function() {

  this.route('sign_in');
  this.route('sign_up');

  this.route('help');

  this.resource('user', function() {
    this.route('dashboard');
    this.route('profile');
  });

  this.resource('password_resets', function() {
    this.route('new');
    this.route('request', {path: '/request/:token'});
  });

  this.resource('securities', function() {
    this.route('show', {path: ':security_id'});
  });


  // LAST!
  this.route("notFound", { path: "*path"});
});

export default Router;
