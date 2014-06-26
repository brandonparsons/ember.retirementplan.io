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
  this.route('accept_terms');


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
    this.route('new');
    this.route('edit');
  });

  this.resource('select_portfolio', function() {
    this.route('chart', { path: '/' } );
  });

  this.resource('retirement_simulation', function() {
    this.route('expenses');
    this.route('parameters');
    this.route('simulate');
  });

  this.resource('tracked_portfolio', function() {
    this.route('show', { path: '/' } );
    this.route('select_etfs');
    this.route('rebalance');
  });


  // LAST!
  this.route("notFound", { path: "*path" } );
});

export default Router;
