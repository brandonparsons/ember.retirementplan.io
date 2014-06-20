export default function (number, decimalPlaces) {
  var asNumber = window.parseFloat(number);
  return +asNumber.toFixed(decimalPlaces);
}
