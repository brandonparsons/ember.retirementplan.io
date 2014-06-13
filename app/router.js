import Ember from 'ember';

var Router = Ember.Router.extend({
  location: RetirementPlanENV.locationType
});

Router.map(function() {

  /////////////////
  // APP-GENERIC //
  /////////////////

  // See: https://speakerdeck.com/elucid/ember-errors-and-you
  this.route('error', {path: '/error/:error_id'});

  this.route('sign_in');
  this.route('sign_up');

  this.route('help');
  this.route('terms');


  //////////
  // USER //
  //////////

  this.resource('user', function() {
    this.route('dashboard');
    this.route('profile');
    this.route('preferences');
  });

  this.resource('password_reset', function() {
    this.route('new',   { path: '/' } );
    this.route('reset', { path: '/reset/:token' } );
  });

  this.resource('email_confirmation', function() {
    this.route('new',     { path: '/' } );
    this.route('confirm', { path: '/confirm/:token' } );
  });


  //////////
  // APP //
  //////////

  this.resource('questionnaire', function() {
    this.route('new',   { path: '/new' } );
    this.route('edit',  { path: '/edit' } );
  });

  // Not done!
  this.resource('select_portfolio', function() {
    this.route('empty', { path: '/' } );
    this.route('chart', { path: '/chart'} );
  });

  // Not done!
  this.resource('retirement_simulation', function() {
    this.route('expenses',    { path: '/expenses' } );
    this.route('parameters',  { path: '/parameters' } );
    this.route('simulate',    { path: '/simulate' } );
  });

  // Not done!
  this.resource('track_portfolio', function() {
    this.route('show', { path: '/' } );
  });


  // Filler for now - delete later
  this.resource('securities', function() {
    this.route('show', { path: '/:security_id' } );
  });


  // LAST!
  this.route("notFound", { path: "*path" } );
});

export default Router;
