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

  this.resource('password_reset', function() {
    this.route('new', {path: '/'});
    this.route('reset', {path: '/reset/:token'});
  });

  this.resource('email_confirmation', function() {
    this.route('new', {path: '/'});
    this.route('confirm', {path: '/confirm/:token'});
  });

  this.resource('securities', function() {
    this.route('show', {path: ':security_id'});
  });


  // LAST!
  this.route("notFound", { path: "*path"});
});

export default Router;
