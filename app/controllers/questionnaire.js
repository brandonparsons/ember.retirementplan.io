import Ember from 'ember';

var questionnaireController = Ember.ObjectController.extend(
  Ember.Validations.Mixin, {

  sexOptions: [
    {id: 0, name: 'Female'},
    {id: 1, name: 'Male'}
  ],

  marriedOptions: [
    {id: 0, name: 'Single'},
    {id: 1, name: 'Married/Common Law/etc.'}
  ],

  realEstateValueOptions: [
    {id: 0, name: '$0'},
    {id: 1, name: '$0-$10,000'},
    {id: 2, name: '$10,000-$50,000'},
    {id: 3, name: '$50,000-$100,000'},
    {id: 4, name: '$100,000-$500,000'},
    {id: 5, name: '$500,000-$1,000,000'},
    {id: 6, name: 'over $1,000,000'}
  ],

  savingReasonOptions: [
    {id: 0, name: 'Liquidity and consumption'},
    {id: 1, name: 'Education and family'}
  ],

  investmentTimelineOptions: [
    {id: 0, name: 'No'},
    {id: 1, name: 'Yes'}
  ],

  investmentTimelineLengthOptions: [
    {id: 0, name: 'No'},
    {id: 1, name: 'Yes'}
  ],

  economyPerformanceOptions: [
    {id: 0, name: 'Better'},
    {id: 1, name: 'Worse'}
  ],

  financialRiskOptions: [
    {id: 0, name: 'Yes'},
    {id: 1, name: 'No'}
  ],

  creditCardOptions: [
    {id: 0, name: 'No'},
    {id: 1, name: 'Yes'}
  ],

  pensionOptions: [
    {id: 0, name: '$0'},
    {id: 1, name: '$1-$499'},
    {id: 2, name: '$500-$999'},
    {id: 3, name: '$1,000-$1,999'},
    {id: 4, name: '$2,000-$4,999'},
    {id: 5, name: '$5,000-$9,999'},
    {id: 6, name: 'over $10,000'}
  ],

  inheritanceOptions: [
    {id: 0, name: '$0'},
    {id: 1, name: '$1-$10,000'},
    {id: 2, name: '$10,000-$50,000'},
    {id: 3, name: '$50,000-$100,000'},
    {id: 4, name: '$100,000-$500,000'},
    {id: 5, name: '$500,000-$1,000,000'},
    {id: 6, name: 'over $1,000,000'}
  ],

  bequeathOptions: [
    {id: 0, name: 'Yes'},
    {id: 1, name: 'No'}
  ],

  degreeOptions: [
    {id: 1, name: "Nursing, Chiropratic, other"},
    {id: 2, name: "Associate's, junior college"},
    {id: 3, name: "Bachelor's degree"},
    {id: 4, name: "MA, MS, MBA"},
    {id: 5, name: "PhD, MD, Law, JD, other doct."}
  ],

  loanOptions: [
    {id: 0, name: 'Yes'},
    {id: 1, name: 'No'}
  ],

  forseeableExpensesOptions: [
    {id: 0, name: 'Yes'},
    {id: 1, name: 'No'}
  ],

  emergencyFundOptions: [
    {id: 0, name: '$0'},
    {id: 1, name: '$1-$10,000'},
    {id: 2, name: '$10,000-$50,000'},
    {id: 3, name: '$50,000-$100,000'},
    {id: 4, name: '$100,000-$500,000'},
    {id: 5, name: '$500,000-$1,000,000'},
    {id: 6, name: 'over $1,000,000'}
  ],

  jobTitleOptions: [
    {id: 0, name: 'Managerial, Executive'},
    {id: 1, name: 'Technical, Sales, Administrative'},
    {id: 2, name: 'Operator, Fabricator, Laborer'}
  ],

  investmentExperienceOptions: [
    {id: 0, name: 'Limited (little understanding of investing and limited experience with different types of investments)'},
    {id: 1, name: 'Average (understand investing basics and have some experience with different types of investments)'},
    {id: 2, name: 'Good (comfortable understanding of investing and a good deal of experience with different types of investments)'},
    {id: 3, name: 'Expert (excellent understanding of investing and a great deal of experience with a variety of investments and strategies)'}
  ],

});


questionnaireController.reopen({
  validations: {

    sex: {
      presence: {
        message: 'You must select an option'
      },
      numericality: {
        onlyInteger: true,
        greaterThanOrEqualTo: 0,
        lessThanOrEqualTo: 1
      }
    },

    age: {
      presence: {
        message: 'You must select an option'
      },
      numericality: {
        onlyInteger: true,
        greaterThanOrEqualTo: 1,
        lessThanOrEqualTo: 120
      }
    },

    married: {
      presence: {
        message: 'You must select an option'
      },
      numericality: {
        onlyInteger: true,
        greaterThanOrEqualTo: 0,
        lessThanOrEqualTo: 1
      }
    },

    noPeople: {
      presence: {
        message: 'You must select an option'
      },
      numericality: {
        onlyInteger: true,
        greaterThanOrEqualTo: 1,
        lessThanOrEqualTo: 20
      }
    },

    realEstateVal: {
      presence: {
        message: 'You must select an option'
      },
      numericality: {
        onlyInteger: true,
        greaterThanOrEqualTo: 0,
        lessThanOrEqualTo: 6
      }
    },

    savingReason: {
      presence: {
        message: 'You must select an option'
      },
      numericality: {
        onlyInteger: true,
        greaterThanOrEqualTo: 0,
        lessThanOrEqualTo: 1
      }
    },

    investmentTimeline: {
      presence: {
        message: 'You must select an option'
      },
      numericality: {
        onlyInteger: true,
        greaterThanOrEqualTo: 0,
        lessThanOrEqualTo: 1
      }
    },

    investmentTimelineLength: {
      presence: {
        message: 'You must select an option'
      },
      numericality: {
        onlyInteger: true,
        greaterThanOrEqualTo: 0,
        lessThanOrEqualTo: 1
      }
    },

    economyPerformance: {
      presence: {
        message: 'You must select an option'
      },
      numericality: {
        onlyInteger: true,
        greaterThanOrEqualTo: 0,
        lessThanOrEqualTo: 1
      }
    },

    financialRisk: {
      presence: {
        message: 'You must select an option'
      },
      numericality: {
        onlyInteger: true,
        greaterThanOrEqualTo: 0,
        lessThanOrEqualTo: 1
      }
    },

    creditCard: {
      presence: {
        message: 'You must select an option'
      },
      numericality: {
        onlyInteger: true,
        greaterThanOrEqualTo: 0,
        lessThanOrEqualTo: 1
      }
    },

    pension: {
      presence: {
        message: 'You must select an option'
      },
      numericality: {
        onlyInteger: true,
        greaterThanOrEqualTo: 0,
        lessThanOrEqualTo: 6
      }
    },

    inheritance: {
      presence: {
        message: 'You must select an option'
      },
      numericality: {
        onlyInteger: true,
        greaterThanOrEqualTo: 0,
        lessThanOrEqualTo: 6
      }
    },

    bequeath: {
      presence: {
        message: 'You must select an option'
      },
      numericality: {
        onlyInteger: true,
        greaterThanOrEqualTo: 0,
        lessThanOrEqualTo: 1
      }
    },

    degree: {
      presence: {
        message: 'You must select an option'
      },
      numericality: {
        onlyInteger: true,
        greaterThanOrEqualTo: 1,
        lessThanOrEqualTo: 5
      }
    },

    loan: {
      presence: {
        message: 'You must select an option'
      },
      numericality: {
        onlyInteger: true,
        greaterThanOrEqualTo: 0,
        lessThanOrEqualTo: 1
      }
    },

    forseeableExpenses: {
      presence: {
        message: 'You must select an option'
      },
      numericality: {
        onlyInteger: true,
        greaterThanOrEqualTo: 0,
        lessThanOrEqualTo: 1
      }
    },

    emergencyFund: {
      presence: {
        message: 'You must select an option'
      },
      numericality: {
        onlyInteger: true,
        greaterThanOrEqualTo: 0,
        lessThanOrEqualTo: 6
      }
    },

    jobTitle: {
      presence: {
        message: 'You must select an option'
      },
      numericality: {
        onlyInteger: true,
        greaterThanOrEqualTo: 0,
        lessThanOrEqualTo: 2
      }
    },

    investmentExperience: {
      presence: {
        message: 'You must select an option'
      },
      numericality: {
        onlyInteger: true,
        greaterThanOrEqualTo: 0,
        lessThanOrEqualTo: 3
      }
    },

  }
});

export default questionnaireController;
