export default Ember.Controller.extend({

  needs: ['login'],

  progress: 45,

  myModalButtons: [
    Ember.Object.create({title: 'Submit', clicked:'submitModal'}),
    Ember.Object.create({title: 'Cancel', clicked:'cancelModal', dismiss: 'modal'})
  ],

  buttonGroupOptions: [
    Ember.Object.create({title: 'Option 1'}),
    Ember.Object.create({title: 'Option 2'})
  ],


  // Popover objects
  hoverPop: Ember.Object.create({
    title: "I'm a title!",
    content: "And i'm a content!",
    trigger: "hover",
    placement: "right",
    sticky: false
  }),

  stickyPop: Ember.Object.create({
    title: "I'm a title!",
    content: "And i'm a content!",
    trigger: "hover",
    placement: "right",
    sticky: true
  }),

  clickPop: Ember.Object.create({
    title: "Clickable!",
    content: "This is a clickable popover",
    placement: "auto bottom"
  }),

  actions: {

    changeProgress: function() {
      this.set('progress', 75);
    },

    showModal: function() {
      Bootstrap.ModalManager.show('myModal');
    },

    submitModal: function() {
      RetirementPlan.setFlash('success', 'Submitted modal!');
      Bootstrap.ModalManager.hide('myModal');
    },

    cancelModal: function() {
      RetirementPlan.setFlash('notice', 'Cancelled modal....');
    },

    authenticateWithHelloJs: function(provider) {
      this.get('controllers.login').send('authenticateWithHelloJs', provider);
    }

  }

});
