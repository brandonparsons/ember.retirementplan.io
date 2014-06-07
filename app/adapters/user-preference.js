import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  pathForType: function() {
    // type (first function argument) === 'user-preference'
    return 'users/preferences';
  }
});
