// Not going to call this titleize-string (i.e. with a dash), therefore we need
// to manually import this in app.js.

export default function(str) { //, options
  if (str == null) {
    return '';
  }
  str = String(str).toLowerCase();
  return str.replace(/(?:^|\s|-)\S/g, function(c){ return c.toUpperCase(); });
}
