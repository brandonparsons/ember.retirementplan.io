import Ember from 'ember';

var simulationParametersController = Ember.ObjectController.extend(
  Ember.Validations.Mixin, {


  ////////////////////////
  // Select box options //
  ////////////////////////

  userIsMaleOptions: [
    {id: true, name: 'Male'},
    {id: false, name: 'Female'}
  ],

  marriedOptions: [
    {id: true, name: 'Yes'},
    {id: false, name: 'No'}
  ],

  userRetiredOptions: [
    {id: true, name: 'Yes'},
    {id: false, name: 'No'}
  ],

  includeHomeOptions: [
    {id: true, name: 'Yes'},
    {id: false, name: 'No'}
  ],


  /////////////////////////
  // Computed Properties //
  /////////////////////////

  // Form-related

  hideMaleAge: function() {
    var married = this.get('married');
    if (typeof married === 'undefined') {
      return false; // If they haven't clicked anything, don't hide
    } else {
      return !married && !this.get('userIsMale');
    }
  }.property('married', 'userIsMale'),

  hideFemaleAge: function() {
    var married = this.get('married');
    if (typeof married === 'undefined') {
      return false; // If they haven't clicked anything, don't hide
    } else {
      return !married && this.get('userIsMale');
    }
  }.property('married', 'userIsMale'),

  hideRetirementAgeMale: function() {
    if (this.get('hideMaleAge')) {
      return true;
    } else {
      return this.get('userRetired');
    }
  }.property('userRetired', 'hideMaleAge'),

  hideRetirementAgeFemale: function() {
    if (this.get('hideFemaleAge')) {
      return true;
    } else {
      return this.get('userRetired');
    }
  }.property('userRetired', 'hideFemaleAge'),

  hideRetirementTimingTitle:    Ember.computed.and('hideRetirementAgeMale', 'hideRetirementAgeFemale'),
  showTwoPersonModellingTitle:  Ember.computed.and('married'), // # Careful if you add additional properties under this title
  showFractionForSingleIncome:  Ember.computed.and('married', 'bothWorkingFromStart'),

  // Validation-related

  validateRetirementAgeMale: function() {
    var userIsMale  = this.get('userIsMale');
    var married     = this.get('married');

    if ( Ember.isNone(userIsMale) || Ember.isNone(married) ) {
      return false;
    } else {
      return userIsMale || married;
    }
  }.property('userIsMale', 'married'),

  validateRetirementAgeFemale: function() {
    var userIsMale  = this.get('userIsMale');
    var married     = this.get('married');

    if ( Ember.isNone(userIsMale) || Ember.isNone(married) ) {
      return false;
    } else {
      return !userIsMale || married;
    }
  }.property('userIsMale', 'married'),

  validateFractionForSingleIncome: function() {
    return this.get('married') && this.get('bothWorkingFromStart');
  }.property('married', 'bothWorkingFromStart'),


  ///////////////
  // Observers //
  ///////////////

  hideMaleAgeChanged: function() {
    if ( this.get('hideMaleAge') ) {
      this.set('maleAge', null);
    }
  }.observes('hideMaleAge'),

  hideFemaleAgeChanged: function() {
    if ( this.get('hideFemaleAge') ) {
      this.set('femaleAge', null);
    }
  }.observes('hideFemaleAge'),

  hideRetirementAgeMaleChanged: function() {
    if ( this.get('hideRetirementAgeMale') ) {
      this.set('retirementAgeMale', null);
    }
  }.observes('hideRetirementAgeMaleChanged'),

  hideRetirementAgeFemaleChanged: function() {
    if ( this.get('hideRetirementAgeFemale') ) {
      this.set('retirementAgeFemale', null);
    }
  }.observes('hideRetirementAgeFemaleChanged'),

  allRetiredFromStartChanged: function() {
    if ( this.get('allRetiredFromStart') ) {
      this.set('income', null);
      this.set('currentTaxRate', 35);
      this.set('salaryIncrease', 3);
      this.set('retirementExpenses', 100);
    }
  }.observes('allRetiredFromStart'),

  includeHomeChanged: function() {
    if ( !this.get('includeHome') ) {
      this.set('homeValue', null);
      this.set('sellHouseIn', null);
      this.set('newHomeRelativeValue', null);
    }
  }.observes('includeHome'),

  marriedChanged: function() {
    var married = this.get('married');
    if ( !Ember.isNone(married) && !married ) {
      this.set('expensesMultiplier', 1.6);
      if ( this.get('userIsMale') ) {
        this.set('femaleAge', null);
        this.set('retirementAgeFemale', null);
      } else {
        this.set('maleAge', null);
        this.set('retirementAgeMale', null);
      }
    }
  }.observes('married', 'userIsMale'),

  showFractionForSingleIncomeChanged: function() {
    if ( !this.get('showFractionForSingleIncome') ) {
      this.set('fractionForSingleIncome', null);
    }
  }.observes('showFractionForSingleIncome'),

  userRetiredChanged: function() {
    if ( this.get('userRetired') ) {
      this.set('retirementAgeMale', this.get('maleAge'));
      this.set('retirementAgeFemale', this.get('femaleAge'));
    } else {
      this.set('retirementAgeMale', null);
      this.set('retirementAgeFemale', null);
    }
  }.observes('userRetired', 'maleAge', 'femaleAge'),

});


simulationParametersController.reopen({

  validations: {

    userIsMale:             {
      presence: true,
      inclusion: {
        in: [true, false]
      }
    },

    married:                {
      presence: true,
      inclusion: {
        in: [true, false]
      }
    },

    maleAge:                {
      presence: {
        unless: 'hideMaleAge'
      },
      numericality: {
        unless: 'hideMaleAge',
        onlyInteger: true,
        greaterThanOrEqualTo: 1,
        lessThanOrEqualTo: 120
      }
    },

    femaleAge:              {
      presence: {
        unless: 'hideFemaleAge'
      },
      numericality: {
        unless: 'hideFemaleAge',
        onlyInteger: true,
        greaterThanOrEqualTo: 1,
        lessThanOrEqualTo: 120
      }
    },

    userRetired:            {
      presence: true,
      inclusion: {
        in: [true, false]
      }
    },

    retirementAgeMale:      {
      presence: {
        if: 'validateRetirementAgeMale'
      },
      numericality: {
        if: 'validateRetirementAgeMale',
        onlyInteger: true,
        greaterThanOrEqualTo: 1,
        lessThanOrEqualTo: 120
      }
    },

    retirementAgeFemale:    {
      presence: {
        if: 'validateRetirementAgeFemale'
      },
      numericality: {
        if: 'validateRetirementAgeFemale',
        onlyInteger: true,
        greaterThanOrEqualTo: 1,
        lessThanOrEqualTo: 120
      }
    },

    assets:                 {
      presence: true,
      numericality: {
        greaterThanOrEqualTo: 0
      }
    },

    expensesInflationIndex: {
      presence: true,
      numericality: {
        greaterThanOrEqualTo: 0
      }
    },

    lifeInsurance:          {
      presence: true,
      numericality: {
        greaterThanOrEqualTo: 0
      }
    },

    income:                 {
      presence: {
        unless: 'allRetiredFromStart'
      },
      numericality: {
        unless: 'allRetiredFromStart',
        greaterThan: 0
      }
    },

    currentTaxRate:         {
      presence: {
        unless: 'allRetiredFromStart'
      },
      numericality: {
        unless: 'allRetiredFromStart',
        greaterThan: 5,
        lessThan: 75
      }
    },

    salaryIncrease:         {
      presence: {
        unless: 'allRetiredFromStart'
      },
      numericality: {
        unless: 'allRetiredFromStart',
        greaterThanOrEqualTo: 0,
        lessThan: 20
      }
    },

    retirementIncome:       {
      presence: true,
      numericality: {
        greaterThanOrEqualTo: 0
      }
    },

    retirementExpenses:     {
      presence: true,
      numericality: {
        greaterThan: 0,
        lessThan: 200
      }
    },

    retirementTaxRate:      {
      presence: true,
      numericality: {
        greaterThan: 5,
        lessThan: 75
      }
    },

    incomeInflationIndex:   {
      presence: true,
      numericality: {
        greaterThanOrEqualTo: 0,
        lessThanOrEqualTo: 100
      }
    },

    includeHome:            {
      presence: true,
      inclusion: {
        in: [true, false]
      }
    },

    homeValue:              {
      presence: {
        if: 'includeHome'
      },
      numericality: {
        if: 'includeHome',
        greaterThan: 0,
      }
    },

    sellHouseIn:            {
      presence: {
        if: 'includeHome'
      },
      numericality: {
        if: 'includeHome',
        greaterThan: 0,
        lessThan: 100
      }
    },

    newHomeRelativeValue:   {
      presence: {
        if: 'includeHome'
      },
      numericality: {
        if: 'includeHome',
        greaterThan: 0,
        lessThan: 1000
      }
    },

    expensesMultiplier:     {
      presence: {
        if: 'married'
      },
      numericality: {
        if: 'married',
        greaterThan: 0,
        lessThanOrEqualTo: 3,
      }
    },

    fractionForSingleIncome:{
      presence: {
        if: 'validateFractionForSingleIncome'
      },
      numericality: {
        if: 'validateFractionForSingleIncome',
        greaterThan: 0,
        lessThanOrEqualTo: 100,
      }
    },

  }
});


export default simulationParametersController;
