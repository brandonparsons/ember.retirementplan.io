valid: Ember.computed.and('userIsMaleValid', 'marriedValid', 'userRetiredValid', 'maleAgeValid', 'femaleAgeValid', 'retirementAgeMaleValid', 'retirementAgeFemaleValid', 'assetsValid', 'expensesInflationIndexValid', 'lifeInsuranceValid', 'incomeValid', 'currentTaxRateValid', 'salaryIncreaseValid', 'retirementIncomeValid', 'retirementExpensesValid', 'retirementTaxRateValid', 'incomeInflationIndexValid', 'includeHomeValid', 'homeValueValid', 'sellHouseInValid', 'newHomeRelativeValueValid', 'expensesMultiplierValid', 'fractionForSingleIncomeValid'),
invalid: Ember.computed.not('valid'),
userIsMaleValid: Ember.computed.and('userIsMalePresent', 'userIsMaleValueValid'),
userIsMalePresent: Ember.computed.notEmpty('userIsMale'),
userIsMaleValueValid: Ember.computed.among('userIsMale', 0, 1),
marriedValid: Ember.computed.and('marriedPresent', 'marriedValueValid'),
marriedPresent: Ember.computed.notEmpty('married'),
marriedValueValid: Ember.computed.among('married', 0, 1),
userRetiredValid: Ember.computed.and('userRetiredPresent', 'userRetiredValueValid'),
userRetiredPresent: Ember.computed.notEmpty('userRetired'),
userRetiredValueValid: Ember.computed.among('userRetired', 0, 1),
maleAgeValid: Ember.computed(function() {
  if (this.get('hideMaleAge')) {
    return true;
  } else {
    return this.get('maleAgeValidHigh') && this.get('maleAgeValidLow');
  }
}).property('hideMaleAge', 'maleAgeValidHigh', 'maleAgeValidLow'),
maleAgeValidHigh: Ember.computed.lt('maleAge', 120),
maleAgeValidLow: Ember.computed.gt('maleAge', 0),
femaleAgeValid: Ember.computed(function() {
  if (this.get('hideFemaleAge')) {
    return true;
  } else {
    return this.get('femaleAgeValidHigh') && this.get('femaleAgeValidLow');
  }
}).property('hideFemaleAge', 'femaleAgeValidHigh', 'femaleAgeValidLow'),
femaleAgeValidHigh: Ember.computed.lt('femaleAge', 120),
femaleAgeValidLow: Ember.computed.gt('femaleAge', 0),
retirementAgeMaleValid: Ember.computed(function() {
  if (this.get('userIsMalePresent') && this.get('marriedPresent') && !this.get('userIsMale') && !this.get('married')) {
    return true;
  } else {
    return this.get('retirementAgeMalePresent') && this.get('retirementAgeMaleValueValid');
  }
}).property('userIsMale', 'userIsMalePresent', 'married', 'marriedPresent', 'retirementAgeMalePresent', 'retirementAgeMaleValueValid'),
retirementAgeMalePresent: Ember.computed.notEmpty('retirementAgeMale'),
retirementAgeMaleValueValid: Ember.computed.gte('retirementAgeMale', 0),
retirementAgeFemaleValid: Ember.computed(function() {
  if (this.get('userIsMalePresent') && this.get('marriedPresent') && this.get('userIsMale') && !this.get('married')) {
    return true;
  } else {
    return this.get('retirementAgeFemalePresent') && this.get('retirementAgeFemaleValueValid');
  }
}).property('userIsMale', 'userIsMalePresent', 'married', 'marriedPresent', 'retirementAgeFemalePresent', 'retirementAgeFemaleValueValid'),
retirementAgeFemalePresent: Ember.computed.notEmpty('retirementAgeFemale'),
retirementAgeFemaleValueValid: Ember.computed.gte('retirementAgeFemale', 0),
assetsValid: Ember.computed.gte('assets', 0),
expensesInflationIndexValid: Ember.computed.gt('expensesInflationIndex', 0),
lifeInsuranceValid: Ember.computed.gte('lifeInsurance', 0),
incomeValid: Ember.computed(function() {
  if (this.get('allRetiredFromStart')) {
    return true;
  } else {
    return this.get('incomeValueValid');
  }
}).property('income', 'allRetiredFromStart'),
incomeValueValid: Ember.computed.gt('income', 0),
currentTaxRateValid: Ember.computed(function() {
  if (this.get('allRetiredFromStart')) {
    return true;
  } else {
    return this.get('currentTaxRateValueValid');
  }
}).property('allRetiredFromStart', 'currentTaxRateValueValid'),
currentTaxRateValueValid: Ember.computed.and('currentTaxRateValidHigh', 'currentTaxRateValidLow'),
currentTaxRateValidHigh: Ember.computed.lt('currentTaxRate', 75),
currentTaxRateValidLow: Ember.computed.gt('currentTaxRate', 5),
salaryIncreaseValid: Ember.computed(function() {
  if (this.get('allRetiredFromStart')) {
    return true;
  } else {
    return this.get('salaryIncreaseValueValid');
  }
}).property('allRetiredFromStart', 'salaryIncreaseValueValid'),
salaryIncreaseValueValid: Ember.computed.and('salaryIncreaseValidHigh', 'salaryIncreaseValidLow'),
salaryIncreaseValidHigh: Ember.computed.lt('salaryIncrease', 30),
salaryIncreaseValidLow: Ember.computed.gte('salaryIncrease', 0),
retirementIncomeValid: Ember.computed.gte('retirementIncome', 0),
retirementExpensesValid: Ember.computed.and('retirementExpensesValidHigh', 'retirementExpensesValidLow'),
retirementExpensesValidHigh: Ember.computed.lt('retirementExpenses', 200),
retirementExpensesValidLow: Ember.computed.gt('retirementExpenses', 0),
retirementTaxRateValid: Ember.computed.and('retirementTaxRateValidHigh', 'retirementTaxRateValidLow'),
retirementTaxRateValidHigh: Ember.computed.lt('retirementTaxRate', 75),
retirementTaxRateValidLow: Ember.computed.gt('retirementTaxRate', 5),
incomeInflationIndexValid: Ember.computed.and('incomeInflationIndexValidHigh', 'incomeInflationIndexValidLow'),
incomeInflationIndexValidHigh: Ember.computed.lte('incomeInflationIndex', 100),
incomeInflationIndexValidLow: Ember.computed.gte('incomeInflationIndex', 0),
includeHomeValid: Ember.computed.among('includeHome', 0, 1),
homeValueValid: Ember.computed(function() {
  if (this.get('includeHome')) {
    return this.get('homeValue') > 0;
  } else {
    return true;
  }
}).property('includeHome', 'homeValue'),
sellHouseInValid: Ember.computed(function() {
  if (this.get('includeHome')) {
    return this.get('sellHouseIn') > 0;
  } else {
    return true;
  }
}).property('includeHome', 'sellHouseIn'),
newHomeRelativeValueValid: Ember.computed(function() {
  if (this.get('includeHome')) {
    return this.get('newHomeRelativeValue') > 0;
  } else {
    return true;
  }
}).property('includeHome', 'newHomeRelativeValue'),
expensesMultiplierValid: Ember.computed(function() {
  if (this.get('marriedPresent') && this.get('married')) {
    return this.get('expensesMultiplierValidHigh') && this.get('expensesMultiplierValidLow');
  } else {
    return true;
  }
}).property('married', 'marriedPresent', 'expensesMultiplierValidHigh', 'expensesMultiplierValidLow'),
expensesMultiplierValidHigh: Ember.computed.lte('expensesMultiplier', 10),
expensesMultiplierValidLow: Ember.computed.gt('expensesMultiplier', 0),
fractionForSingleIncomeValid: Ember.computed(function() {
  if (this.get('married') && this.get('bothWorkingFromStart')) {
    return this.get('fractionForSingleIncomeValidHigh') && this.get('fractionForSingleIncomeValidLow');
  } else {
    return true;
  }
}).property('married', 'bothWorkingFromStart', 'fractionForSingleIncomeValidHigh', 'fractionForSingleIncomeValidLow'),
fractionForSingleIncomeValidHigh: Ember.computed.lte('fractionForSingleIncome', 100),
fractionForSingleIncomeValidLow: Ember.computed.gt('fractionForSingleIncome', 0)
