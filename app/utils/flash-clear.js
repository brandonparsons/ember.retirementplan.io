import FlashQueue from '../objects/flash-queue';

var clearFlash = function () {
  FlashQueue.empty();
  return true;
};

export default clearFlash;
