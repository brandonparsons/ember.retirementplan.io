# This does NOT test all of the functionality of the RetirementSimulationParameters
# model. Just the more complicated logic.

module 'RetirementSimulationParameters model',
  setup: ->
    Ember.run =>
      @newRecord    = store().createRecord('retirementSimulationParameters')

      @validRecord  = store().createRecord('retirementSimulationParameters')
      @validRecord.set 'userIsMale', 1
      @validRecord.set 'married', 1
      @validRecord.set 'userRetired', 0
      @validRecord.set 'maleAge', 29
      @validRecord.set 'femaleAge', 29
      @validRecord.set 'retirementAgeMale', 65
      @validRecord.set 'retirementAgeFemale', 31
      @validRecord.set 'assets', 100000
      @validRecord.set 'expensesInflationindex', 100
      @validRecord.set 'lifeInsurance', 50000
      @validRecord.set 'income', 150000
      @validRecord.set 'currentTaxRate', 30
      @validRecord.set 'salaryIncrease', 3
      @validRecord.set 'retirementIncome', 15000
      @validRecord.set 'retirementExpenses', 100
      @validRecord.set 'retirementTaxRate', 35
      @validRecord.set 'incomeInflationIndex', 2
      @validRecord.set 'includeHome', 1
      @validRecord.set 'homeValue', 500000
      @validRecord.set 'sellHouseIn', 20
      @validRecord.set 'newHomeRelativeValue', 65
      @validRecord.set 'expensesMultiplier', 1.6
      @validRecord.set 'fractionForSingleIncome', 85

      @validityObject = (record) ->
        {
          "userIsMaleValid" : record.get 'userIsMaleValid'
          "marriedValid" : record.get 'marriedValid'
          "userRetiredValid" : record.get 'userRetiredValid'
          "maleAgeValid" : record.get 'maleAgeValid'
          "femaleAgeValid" : record.get 'femaleAgeValid'
          "retirementAgeMaleValid" : record.get 'retirementAgeMaleValid'
          "retirementAgeFemaleValid" : record.get 'retirementAgeFemaleValid'
          "assetsValid" : record.get 'assetsValid'
          "expensesInflationIndexValid" : record.get 'expensesInflationIndexValid'
          "lifeInsuranceValid" : record.get 'lifeInsuranceValid'
          "incomeValid" : record.get 'incomeValid'
          "currentTaxRateValid" : record.get 'currentTaxRateValid'
          "salaryIncreaseValid" : record.get 'salaryIncreaseValid'
          "retirementIncomeValid" : record.get 'retirementIncomeValid'
          "retirementExpensesValid" : record.get 'retirementExpensesValid'
          "retirementTaxRateValid" : record.get 'retirementTaxRateValid'
          "incomeInflationIndexValid" : record.get 'incomeInflationIndexValid'
          "includeHomeValid" : record.get 'includeHomeValid'
          "homeValueValid" : record.get 'homeValueValid'
          "sellHouseInValid" : record.get 'sellHouseInValid'
          "newHomeRelativeValueValid" : record.get 'newHomeRelativeValueValid'
          "expensesMultiplierValid" : record.get 'expensesMultiplierValid'
          "fractionForSingleIncomeValid" : record.get 'fractionForSingleIncomeValid'
        }

test 'can be created', ->
  ok @newRecord.get('isNew')

test 'can create valid', ->
  ok @validRecord.get('valid'), "Valid record was not valid...."

test 'bothWorkingFromStart', ->
  r = @validRecord
  reset = ->
    r.set 'married', 1
    r.set 'maleAge', 30
    r.set 'retirementAgeMale', 69
    r.set 'femaleAge', 30
    r.set 'retirementAgeFemale', 65

  Ember.run ->
    reset()
    ok r.get('bothWorkingFromStart')

    r.set 'retirementAgeFemale', '30'
    ok !r.get("bothWorkingFromStart")
    reset()
    ok r.get('bothWorkingFromStart')

    r.set 'retirementAgeMale', '29'
    ok !r.get("bothWorkingFromStart")
    reset()
    ok r.get('bothWorkingFromStart')

    r.set 'married', 0
    ok !r.get("bothWorkingFromStart")
    reset()
    ok r.get('bothWorkingFromStart')

test 'allRetiredFromStart', ->
  r = @validRecord

  reset = ->
    r.set 'married', 1
    r.set 'maleAge', 30
    r.set 'retirementAgeMale', 69
    r.set 'femaleAge', 30
    r.set 'retirementAgeFemale', 65

  Ember.run ->
    reset()
    ok !r.get('allRetiredFromStart')

    r.set 'retirementAgeFemale', 30
    ok !r.get('allRetiredFromStart')
    r.set 'retirementAgeMale', 30
    ok r.get('allRetiredFromStart')
    r.set 'retirementAgeMale', undefined
    ok !r.get('allRetiredFromStart')
    reset()
    ok !r.get('allRetiredFromStart')

    r.set 'married', 0
    r.set 'userIsMale', 1
    r.set 'retirementAgeMale', 30
    ok r.get('allRetiredFromStart')
    r.set 'retirementAgeMale', 65
    ok !r.get('allRetiredFromStart')
    reset()
    ok !r.get('allRetiredFromStart')

    r.set 'married', 0
    r.set 'userIsMale', 0
    r.set 'femaleAge', 30
    r.set 'retirementAgeFemale', 30
    ok r.get('allRetiredFromStart')
    r.set 'retirementAgeFemale', 65
    ok !r.get('allRetiredFromStart')
    reset()
    ok !r.get('allRetiredFromStart')

test 'userRetiredChanged', ->
  r = @validRecord

  reset = ->
    r.set 'married', 1
    r.set 'userRetired', 0
    r.set 'maleAge', 30
    r.set 'retirementAgeMale', 69
    r.set 'femaleAge', 31
    r.set 'retirementAgeFemale', 65

  Ember.run ->
    reset()
    ok !Ember.isNone(r.get 'retirementAgeMale')
    ok !Ember.isNone(r.get 'retirementAgeFemale')

    r.set 'userRetired', 1
    ok !Ember.isNone(r.get 'retirementAgeMale')
    ok !Ember.isNone(r.get 'retirementAgeFemale')
    ok(r.get('retirementAgeMale') == 30)
    ok(r.get('retirementAgeFemale') == 31)

    r.set 'userRetired', 0
    ok Ember.isNone(r.get 'retirementAgeMale')
    ok Ember.isNone(r.get 'retirementAgeFemale')

test 'maleAgeValid', ->
  r = @validRecord

  Ember.run =>
    r.set 'hideMaleAge', false
    ok r.get('maleAgeValid')

    r.set 'femaleAge', -1
    ok r.get('maleAgeValid')

    r.set 'maleAge', -1
    ok !r.get('maleAgeValid')

    r.set 'maleAge', 121
    ok !r.get('maleAgeValid')

    r.set 'hideMaleAge', true
    ok r.get('maleAgeValid')

test 'femaleAgeValid', ->
  r = @validRecord

  Ember.run =>
    r.set 'hideFemaleAge', false
    ok r.get('femaleAgeValid')

    r.set 'maleAge', -1
    ok r.get('femaleAgeValid')

    r.set 'femaleAge', -1
    ok !r.get('femaleAgeValid')

    r.set 'femaleAge', 121
    ok !r.get('femaleAgeValid')

    r.set 'hideFemaleAge', true
    ok r.get('femaleAgeValid')

test 'retirementAgeMaleValid', ->
  r = @validRecord

  reset = ->
    r.set 'userIsMale', 1
    r.set 'married', 1
    r.set 'maleAge', 30
    r.set 'femaleAge', 30
    r.set 'retirementAgeMale', 65
    r.set 'retirementAgeFemale', 35

  Ember.run =>
    reset()
    ok r.get('retirementAgeMaleValid')

    r.set 'retirementAgeMale', -1
    ok !r.get('retirementAgeMaleValid')

    reset()
    ok r.get('retirementAgeMaleValid')

    r.set 'retirementAgeMale', -1
    r.set 'userIsMale', 0
    r.set 'married', 0
    ok r.get('retirementAgeMaleValid')

test 'retirementAgeFemaleValid', ->
  r = @validRecord

  reset = ->
    r.set 'userIsMale', 0
    r.set 'married', 1
    r.set 'maleAge', 30
    r.set 'femaleAge', 30
    r.set 'retirementAgeMale', 65
    r.set 'retirementAgeFemale', 35

  Ember.run =>
    reset()
    ok r.get('retirementAgeFemaleValid')

    r.set 'retirementAgeFemale', -1
    ok !r.get('retirementAgeFemaleValid')

    reset()
    ok r.get('retirementAgeFemaleValid')

    r.set 'retirementAgeFemale', -1
    r.set 'userIsMale', 1
    r.set 'married', 0
    ok r.get('retirementAgeFemaleValid')
