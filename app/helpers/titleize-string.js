import Ember from 'ember';

// If you want to make these single words (e.g. `titleize`, you have to
// manually import in app.js.  See: http://iamstef.net/ember-cli/)
export default Ember.Handlebars.makeBoundHelper(function(str, options) {
  if (str == null) { return ''; }

  var escaped, shortWords, strArray;

  escaped     = Ember.Handlebars.Utils.escapeExpression(str);
  shortWords  = Ember.A(['of', 'a', 'the', 'and', 'an', 'or', 'nor', 'but', 'is', 'if', 'then', 'else', 'when', 'at', 'from', 'by', 'on', 'off', 'for', 'in', 'out', 'over', 'to', 'into', 'with']);
  strArray    = Ember.A(escaped.split(' '));

  strArray = strArray.map(function(slug, index) {
    if (index === 0 || !shortWords.contains(slug)) {
      return Ember.String.capitalize(slug);
    } else {
      return slug;
    }
  });

  return new Handlebars.SafeString(strArray.join(' '));
});
