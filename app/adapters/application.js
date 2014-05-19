import { request as icAjaxRequest } from 'ic-ajax';

DS.ActiveModelAdapter.reopen({
  // Override standard `ajax` function with ic-ajax wrapper. It does this
  // automatically for the RESTAdapter, but doesn't look like it does for the
  // ActiveModelAdapter.
  ajax: function(url, type, options){
    options = this.ajaxOptions(url, type, options);
    return icAjaxRequest(options);
  }
});

export default DS.ActiveModelAdapter.extend({
  host:       ENV.apiHost,
  namespace:  ENV.apiBaseUrl
});
