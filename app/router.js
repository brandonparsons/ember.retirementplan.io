var Router = Ember.Router.extend({
  location: ENV.locationType
});

Router.map(function() {

  this.route('help');

  this.route('sign_in');
  this.route('sign_up');

  this.route('dashboard');

  this.route('profile');
  this.route('change_password');

  this.resource('securities', function() {
    this.route('show', {path: ':security_id'});
  });


  this.route("notFound", { path: "*path"});
});

export default Router;
