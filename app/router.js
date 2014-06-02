var Router = Ember.Router.extend({
  location: ENV.locationType
});

Router.map(function() {

  this.route('help');

  this.route('login');
  this.route('signup');

  this.route('dashboard');

  this.route('profile');

  this.resource('securities', function() {
    this.route('show', {path: ':security_id'});
  });


  this.route("notFound", { path: "*path"});
});

export default Router;
