import Ember from 'ember';
import roundTo from 'retirement-plan/utils/round-to';

var idToAllocation = function(id) {
  if (Ember.isEmpty(id) || typeof(id) === 'undefined') { return null; }
  return window.atob(id);
};

var FrontierPortfolio = Ember.Object.extend({

  // prattArrowLow : set on create if want all stats
  // prattArrowHigh: set on create if want all stats

  annualRisk: Ember.computed.alias('statistics.annual_std_dev'),
  annualReturn: Ember.computed.alias('statistics.annual_nominal_return'),

  allocation: function() {
    // Decodes the Base64 encoded ID
    var id = this.get('id');
    return idToAllocation(id);
  }.property('id'),

  utilityLow: function() {
    // Purposefully flipped (utility|prattArrow)(low|high).
    var riskAversion = this.get('prattArrowHigh');
    return this._utility(riskAversion);
  }.property('prattArrowHigh'),

  utilityHigh: function() {
    // Purposefully flipped (utility|prattArrow)(low|high).
    var riskAversion = this.get('prattArrowLow');
    return this._utility(riskAversion);
  }.property('prattArrowLow'),

  tenThousandMonthlyReturn: function() {
    var annualReturn = this.get('annualReturn');
    return this._portfolioMonthlyReturnFor(10000, annualReturn);
  }.property('annualReturn'),

  tenThousandValueAtRisk: function() {
    var annualReturn  = this.get('annualReturn');
    var annualRisk    = this.get('annualRisk');
    return this._portfolioDailyVARFor(10000, annualReturn, annualRisk);
  }.property('annualReturn', 'annualRisk'),

  warnings: function() {
    var warningConditions, allocation, allocationIncludes, allocationofAssetAtLeast;

    warningConditions   = [];
    allocation          = this.get('allocation');
    allocationIncludes  = function(assetId) {
      return _.include( Ember.keys(allocation), assetId );
    };
    allocationofAssetAtLeast  = function(assetId, cutoff) {
      return allocationIncludes(assetId) && allocation[assetId] >= cutoff;
    };

    if ( allocationofAssetAtLeast("US-SMCAP-STOCK", 0.4) ) {
      warningConditions.push("This portfolio contains a significant fraction of small cap stocks.  These can be quite volatile - ensure they are acceptable give your risk tolerance.");
    }

    if ( allocationofAssetAtLeast("EMERG-STOCK", 0.4) ) {
      warningConditions.push("This portfolio contains a significant fraction of emerging markets stocks.  These can be quite volatile - ensure they are acceptable give your risk tolerance.");
    }

    if (Ember.keys(allocation).any( function(assetId) { return allocation[assetId] >= 0.90; } )) {
      warningConditions.push("The portfolio you selected has greater than 90% weight in a single asset.  You may select this if you wish, but we suggest that you choose a portfolio with additional diversification.");
    }

    return warningConditions;

    /* For tests */
    // describe "::warnings_for" do
    //   it "returns empty array if no warnings" do
    //     warnings = Portfolio.warnings_for( {"EEM" => 0.2, "BWX" => 0.6, "NAESX" => 0.2} )
    //     expect(warnings).to eql([])
    //   end
    //   it "warns on lots of small cap" do
    //     warnings = Portfolio.warnings_for( {"EEM" => 0.1, "BWX" => 0.4, "NAESX" => 0.5} )
    //     expect(warnings.length).to eql(1)
    //     expect(warnings.first).to match /significant fraction of small cap/
    //   end
    //   it "warns on lots of emerging market" do
    //     warnings = Portfolio.warnings_for( {"EEM" => 0.6, "BWX" => 0.2, "NAESX" => 0.2} )
    //     expect(warnings.length).to eql(1)
    //     expect(warnings.first).to match /significant fraction of emerging market/
    //   end
    //   it "warns on not diversified" do
    //     warnings = Portfolio.warnings_for( {"EEM" => 0.1, "BWX" => 0.9} )
    //     expect(warnings.length).to eql(1)
    //     expect(warnings.first).to match /has greater than 90% weight/
    //   end
    // end
  }.property('allocation'),



  /////////////////////////
  // 'Private' Functions //
  /////////////////////////

  _utility: function(riskAversion) {
    // See dissertation in references equation 3.1 pg. 90
    /*
    For testing:
      pratt_arrow_risk_aversion = 1.3
      portfolio_return = 0.12
      portfolio_stddev = 0.05
      expect(utility).to be_within(0.01).of(0.118375)
    */
    var portfolioReturn = this.get('statistics.annual_nominal_return');
    var portfolioStdDev = this.get('statistics.annual_std_dev');
    var utility = portfolioReturn - ( riskAversion / 2  ) * Math.pow(portfolioStdDev, 2);
    return utility;
  },

  _portfolioMonthlyReturnFor: function(investment, annualReturn) {
    // Needs tests!
    var unrounded = investment * ( Math.pow( (1 + annualReturn), (1.0/12) ) - 1 );
    return roundTo(unrounded, 2);
  },

  _portfolioDailyVARFor: function(investment, annualReturn, annualRisk) {
    // Needs tests!
    var unrounded = -1 * investment * ( annualReturn/250 + (-1.65 * annualRisk/Math.pow(250, 0.5)) );
    return roundTo(unrounded, 2);
  },

});

FrontierPortfolio.reopenClass({
  allocationFromID: function(id) {
    return JSON.parse(idToAllocation(id));
  }
});

export default FrontierPortfolio;
