import Ember from 'ember';

export default Ember.Route.extend(
  Ember.SimpleAuth.AuthenticatedRouteMixin, {

  afterModel: function() {
    var terms = this.controllerFor('user.current').get('acceptedTerms');
    if (!terms) {
      this.transitionTo('accept_terms');
    } else {
      this.transitionTo('questionnaire.new');
    }
  }

});
