import Ember from 'ember';

export default Ember.ObjectController.extend({
  showSidebar: Ember.computed.alias('currentUser.hasTrackedPortfolio')
});
