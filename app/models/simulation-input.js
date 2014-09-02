import DS from 'ember-data';

export default DS.Model.extend({

  //////////////////////////
  // Persisted Properties //
  //////////////////////////

  userIsMale:               DS.attr('boolean'),
  married:                  DS.attr('boolean'),
  maleAge:                  DS.attr('number'),
  femaleAge:                DS.attr('number'),
  userRetired:              DS.attr('boolean'),
  retirementAgeMale:        DS.attr('number'),
  retirementAgeFemale:      DS.attr('number'),
  assets:                   DS.attr('number'),
  expensesInflationIndex:   DS.attr('number',   { defaultValue: 100 }),
  lifeInsurance:            DS.attr('number'),
  income:                   DS.attr('number'),
  currentTaxRate:           DS.attr('number',   { defaultValue: 35 }),
  salaryIncrease:           DS.attr('number',   { defaultValue: 3 }),
  retirementIncome:         DS.attr('number'),
  retirementExpenses:       DS.attr('number',   { defaultValue: 100 }),
  retirementTaxRate:        DS.attr('number',   { defaultValue: 35 }),
  incomeInflationIndex:     DS.attr('number',   { defaultValue: 0 }),
  includeHome:              DS.attr('boolean',  { defaultValue: false }),
  homeValue:                DS.attr('number'),
  sellHouseIn:              DS.attr('number'),
  newHomeRelativeValue:     DS.attr('number'),
  expensesMultiplier:       DS.attr('number',   { defaultValue: 1.6 }),
  fractionForSingleIncome:  DS.attr('number'),


  /////////////////////////
  // Computed Properties //
  /////////////////////////

  bothWorkingFromStart: function() {
    var married, maleAge, maleRetireAge, femaleAge, femaleRetireAge;

    married         = this.get('married');
    maleAge         = this.get('maleAge');
    maleRetireAge   = this.get('retirementAgeMale');
    femaleAge       = this.get('femaleAge');
    femaleRetireAge = this.get('retirementAgeFemale');

    if ( married && (maleRetireAge > maleAge) && (femaleRetireAge > femaleAge) ) {
      return true;
    } else {
      return false;
    }
  }.property('married', 'maleAge', 'retirementAgeMale', 'femaleAge', 'retirementAgeFemale'),

  allRetiredFromStart: function() {
    var maleAge, maleRetireAge, femaleAge, femaleRetireAge, married, male;

    maleAge         = this.get('maleAge');
    maleRetireAge   = this.get('retirementAgeMale');
    femaleAge       = this.get('femaleAge');
    femaleRetireAge = this.get('retirementAgeFemale');
    married         = this.get('married');
    male            = this.get('userIsMale');

    if ( married ) {
      // Married - both need to be retired
      return (maleRetireAge <= maleAge) && (femaleRetireAge <= femaleAge);
    } else {
      // Not married, only one age to check
      if ( male ) {
        return (maleRetireAge <= maleAge);
      } else {
        return (femaleRetireAge <= femaleAge);
      }
    }
  }.property('maleAge', 'retirementAgeMale', 'femaleAge', 'retirementAgeFemale', 'married', 'userIsMale'),

});
