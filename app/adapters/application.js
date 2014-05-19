import { request as icAjaxRequest } from 'ic-ajax';

// Override standard `ajax` function with ic-ajax wrapper. It does this
// automatically for the RESTAdapter, but doesn't look like it does for the
// ActiveModelAdapter.
DS.ActiveModelAdapter.reopen({
  ajax: function(url, type, options){
    options = this.ajaxOptions(url, type, options);
    return icAjaxRequest(options);
  }
});

export default DS.ActiveModelAdapter.extend({
  host: ENV.apiHost
});
