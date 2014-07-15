import setFlash from 'retirement-plan/utils/flash-set';
import clearFlash from 'retirement-plan/utils/flash-clear';

export default {
  name: 'flash-functions',
  initialize: function(container, application) {
    application.setFlash    = setFlash;
    application.clearFlash  = clearFlash;
  }
};
