/* Group portfolios by risk */
// NOT USING RIGHT NOW: Just adding a vertical gridline to separate sets.
// If you want to split into separate data sets by risk, this is how -
// C3's selection functionality doesn't seem to work with mult. data sets though

var optimalRiskUtilityLow = _.max(portfolios, function(portfolio) {
  return portfolio.get('utilityLow');
}).get('annualRisk');

var optimalRiskUtilityHigh = _.max(portfolios, function(portfolio) {
  return portfolio.get('utilityHigh');
}).get('annualRisk');

var groupedPortfolios = portfolios.map( function(portfolio) {
  var thisPortfoliosRisk, riskBucket;

  thisPortfoliosRisk = portfolio.get('annualRisk');
  // riskBucket string values depended on elsewhere (at time of writing), be
  // careful if changing (can search for them)
  if (thisPortfoliosRisk < optimalRiskUtilityLow) {
    riskBucket = "Low Risk Level";
  } else if (thisPortfoliosRisk > optimalRiskUtilityHigh) {
    riskBucket = "High Risk Level";
  } else {
    riskBucket = "Suggested Risk Level";
  }

  return {
    id:     portfolio.get('id'), // base64-encoded allocation
    group:  riskBucket,
    xValue: portfolio.get('annualRisk'),
    yValue: portfolio.get('annualReturn'),
  };
});

/* */
