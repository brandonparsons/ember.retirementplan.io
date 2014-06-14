import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';

Ember.MODEL_FACTORY_INJECTIONS = true;

var App = Ember.Application.extend({
  modulePrefix: 'retirement-plan', // TODO: loaded via config
  Resolver: Resolver,

  // BKP: For ember-debug
  ready: function () {
    if (window.RetirementPlanENV.debug) {
      this.debug.globalize();
    }
  }
});

loadInitializers(App, 'retirement-plan');

export default App;
