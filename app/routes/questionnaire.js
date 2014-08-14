import Ember from 'ember';

export default Ember.Route.extend(
  Ember.SimpleAuth.AuthenticatedRouteMixin, {

  afterModel: function() {
    // Because the user will need to accept the T&C's right off the bat, let's
    // check before they get into the questionnaire. This will save them from
    // filling out the form, only to be sent to accept_terms
    var terms = this.controllerFor('user.current').get('acceptedTerms');
    if (!terms) {
      this.transitionTo('accept_terms');
    } else {
      this.transitionTo('questionnaire.new');
    }
  }

});
