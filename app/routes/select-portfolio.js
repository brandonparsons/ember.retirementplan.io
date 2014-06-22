import Ember from 'ember';
import { request as icAjaxRequest } from 'ic-ajax';

export default Ember.Route.extend(
  Ember.SimpleAuth.AuthenticatedRouteMixin, {

  model: function() { return this.store.find('security'); },

  setupController: function(controller, model) {
    this._super(controller, model);

    // Get the selected tickers and portfolio ID from the server - allows set
    // up of initial state with the proper portfolio selected.
    this._resetSelectionsToCurrent(controller);
  },


  /////////////////////////
  // 'Private' Functions //
  /////////////////////////

  _resetSelectionsToCurrent: function(thisController) {
    icAjaxRequest({
      url:  window.RetirementPlanENV.apiHost + '/portfolio',
      type: 'GET',
    }).then( function(responseJSON) {
      var selectedPortfolioID, portfolioTickers, allocation;

      selectedPortfolioID = responseJSON.portfolio.id;
      allocation          = responseJSON.portfolio.allocation;
      if (selectedPortfolioID && allocation) {
        thisController.set('selectedPortfolioID', selectedPortfolioID);

        portfolioTickers = Ember.keys(allocation);
        thisController.filter( function(securityItemController) {
          return _.include(portfolioTickers, securityItemController.get('ticker') );
        }).forEach( function(securityToSelect) {
          // This fires the observers each time it is set, but you are debouncing
          // the efficientFrontier/graph update.
          securityToSelect.set('checked', true);
        });
      }
    });
  }

});
