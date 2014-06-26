import Ember from 'ember';
import chartColor from 'retirement-plan/utils/chart-color';

export default Ember.Charts.ScatterComponent.extend({

  selectedPortfolioID: null,  // Bound


  /////////////////////////////////
  // Custom Computed Properties //
  ////////////////////////////////

  // NB: These are `FrontierPortfolios` not `Portfolios`

  totalPointData: function() {
    var selectedPortfolioID, selectedPortfolio;

    selectedPortfolioID = this.get('selectedPortfolioID');
    if (Ember.isNone(selectedPortfolioID)) {return null;}

    selectedPortfolio = this.get('data').findBy('id', selectedPortfolioID);
    // if (Ember.isNone(selectedPortfolio)) {return null;}
    return _.merge(_.cloneDeep(selectedPortfolio), {group: 'Selected Portfolio'});
  }.property('selectedPortfolioID', 'data'),

  isShowingTotal: function() {
    return !Ember.isNone(this.get('totalPointData'));
  }.property('totalPointData'),


  ///////////////////////////////////////
  // Ember Charts Component Over-Rides //
  ///////////////////////////////////////

  xValueDisplayName: "Risk (Annual Standard Deviation)",
  yValueDisplayName: "Return (Annual Expected Return)",

  hasLegend: true,

  selectedSeedColor: chartColor('green'),

  formatXValue: window.d3.format('.1%'),
  formatYValue: window.d3.format('.1%'),

  getGroupColor: Ember.computed(function() {
    // The original function from ember-charts doesn't appear to work properly
    var _this = this;
    return function(d) {
      var groupIndex = _this.get('groupNames').indexOf(d.group);
      if (groupIndex === 0) { // Low
        return chartColor('gray');
        // return _this.get('colorScale')(0.6);
      } else if (groupIndex === 1) { // Suggested
        return chartColor('green');
      } else if (groupIndex === 2) { // High
        return chartColor('yellow');
      } else { // Selected Portfolio
        return chartColor('red');
      }
    };
  }),


  //////////////////////
  // Component Hooks //
  /////////////////////

  click: function(e) {
    var objectClickedOn, typeOfDOMNode, dotData;

    objectClickedOn = e.target;
    typeOfDOMNode = Ember.$(objectClickedOn).prop("tagName").toLowerCase();
    if (typeOfDOMNode === 'path') { // They clicked on a datapoint
      dotData = window.d3.select(objectClickedOn).datum();
      this._elementSelected(dotData);
    } else if (typeOfDOMNode === 'svg') { // They clicked on the empty graph
      this._deSelectElement();
    } else {  // They clicked on the axis / axis labels
      this._deSelectElement();
    }
  },


  /////////////////////////
  // 'Private' Functions //
  /////////////////////////

  _elementSelected: function(dotData) {
    this.set('selectedPortfolioID', dotData.id);
    // Also have xValue/yValue on dotData, but not required
  },

  _deSelectElement: function() {
    this.set('selectedPortfolioID', null);
  }

});
