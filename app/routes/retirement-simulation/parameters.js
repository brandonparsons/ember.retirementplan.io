import Ember from 'ember';
import { request as icAjaxRequest } from 'ic-ajax';

export default Ember.Route.extend({

  beforeModel: function() {
    // If they have come to this route, they are implicitly accepting the default
    // expenses we created for them if they did not update them.
    var currentUser = this.controllerFor('user.current');
    if ( !currentUser.get('hasSelectedExpenses') ) {
      icAjaxRequest({
        url:  window.RetirementPlanENV.apiHost + '/expenses/confirm',
        type: 'POST'
      }).then(function() {
        currentUser.set('hasSelectedExpenses', true);
      });
    }
  },

  // model: function() { return store.find('expense'); }
});
