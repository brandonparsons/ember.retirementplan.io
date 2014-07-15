import Ember from 'ember';

export default Ember.ObjectController.extend({
  needs: ['user/current'],
  currentUser: Ember.computed.alias('controllers.user/current'),

  showSidebar: Ember.computed.alias('currentUser.hasTrackedPortfolio')
});
