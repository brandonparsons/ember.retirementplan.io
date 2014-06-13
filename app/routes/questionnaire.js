import Ember from 'ember';

export default Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {

  model: function() {
    return this.controllerFor('user.current').get('questionnaire');
  },

  afterModel: function(model) {
    if (model.get('isNew')) {
      this.transitionTo('questionnaire.new');
    } else {
      this.transitionTo('questionnaire.edit');
    }
  }

});
