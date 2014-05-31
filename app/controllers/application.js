export default Ember.ObjectController.extend({

  // Used for navbar name/image
  needs: ['currentUser'],
  currentUser: Ember.computed.alias('controllers.currentUser')

});
