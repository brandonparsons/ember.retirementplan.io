export default function(arr) {
  var max, min, spread;
  max     = _.max(arr);
  min     = _.min(arr);
  spread  = max - min;
  if (spread === 0.0) {
    // If is always zero (spread == 0), divides by zero and blows up.
    // Just return the original array as it is (probably?) always a pile
    // of zeroes in this case.
    return arr;
  } else {
    return _.map(arr, function(el) {
      return (el - min) / spread; // Not dividing by 100 - already taken care of by d3
    });
  }
};
