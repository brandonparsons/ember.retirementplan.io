import FlashQueue from '../objects/flash-queue';

// * Usage:
// setFlash('error', 'Sorry - something went wrong with your request. Please try again.')
// * First arg options:
// - success
// - notice/info
// - warning/error

var setFlash = function (type, msg, sticky) {
  FlashQueue.add(type, msg, sticky);
  return true;
};

export default setFlash;
