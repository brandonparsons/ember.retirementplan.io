/* global accounting */

export default function (number) {
  if (number === null) { return ''; }
  return accounting.formatMoney(number);
}
