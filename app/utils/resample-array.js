export default function(arr, desiredLength) {
  var chunked, itemsPerBucket;
  if (desiredLength > arr.length) {
    return arr;
  }
  itemsPerBucket = parseInt(arr.length / desiredLength);
  chunked = [];
  while (arr.length) {
    chunked.push(arr.splice(0, itemsPerBucket));
  }
  return _.map(chunked, function(chunk) {
    var total;
    total = _.reduce(chunk, function(sum, val) {
      return sum += val;
    }, 0.0);
    return total / chunk.length;
  });
}
