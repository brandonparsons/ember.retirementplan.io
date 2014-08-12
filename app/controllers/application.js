import Ember from 'ember';

export default Ember.ObjectController.extend({
  needs: ['user/current'],
  currentUser: Ember.computed.alias('controllers.user/current'),

  hasOpenedSidebarMenu: true, // Default to open
  shouldShowSidebar:    Ember.computed.alias('currentUser.hasTrackedPortfolio'),
  showSidebar:          Ember.computed.and('shouldShowSidebar', 'hasOpenedSidebarMenu'),

  actions: {
    toggleSidebar: function() {
      this.toggleProperty('hasOpenedSidebarMenu');
    }
  }

});
