/* global ga */

export default function(category, action, label, value) {
  if (arguments.length === 4) {
    ga('send', 'event', category, action, label, value);
  } else if (arguments.length === 3) {
    ga('send', 'event', category, action, label);
  } else {
    ga('send', 'event', category, action);
  }
}
