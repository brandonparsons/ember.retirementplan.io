import Ember from 'ember';
import errorProcessor from 'retirement-plan/utils/error-processor';
import { request as icAjaxRequest } from 'ic-ajax';
import Portfolio from 'retirement-plan/models/portfolio';

export default Ember.ArrayController.extend({

  selectedPortfolioID:  null,

  hasPortfolioData: Ember.computed.notEmpty('content'),

  actions: {

    // Sent by selectPortfolio controller on change
    updateSecurities: function(tickerArray) {
      if (tickerArray.length > 0) {
        var controller = this;
        icAjaxRequest({
          url:  window.RetirementPlanENV.apiHost + '/efficient_frontier',
          type: 'GET',
          data: { tickers: tickerArray }
        }).then( function(response) {
          controller.send('_setPortfolioDataFromServerInfo', response);
        }, function(errorResponse) {
          var errorMessage = errorProcessor(errorResponse) || "Sorry - something went wrong.  Please try again.";
          RetirementPlan.setFlash('error', errorMessage);
        });
      } else {
        this.set('content', []);
      }
    },

    _setPortfolioDataFromServerInfo: function(efficientFrontierData) {
      var portfolios        = [];
      var rawPortfolioData  = efficientFrontierData.efficient_frontier;
      _.forEach(rawPortfolioData, function(portfolio) {
        portfolios.pushObject(Portfolio.create(portfolio))
      });
      this.set('content', portfolios);
    }

  }

});
