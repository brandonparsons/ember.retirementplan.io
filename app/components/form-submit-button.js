import Ember from 'ember';

export default Ember.Forms.FormSubmitComponent.extend({
  classNames: ['form-group', 'inline', 'float-left'], // On the parent form-group
  classes:    'btn btn-primary', // On the button itself
  horiClass:  'space-left' // Inner div
});
