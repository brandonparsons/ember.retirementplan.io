import Ember from 'ember';

export default Ember.ArrayController.extend({

  groupedByAsset: function() {
    var result = [];

    this.forEach( function(etf) {
      var assetBucket = result.findBy('asset', etf.get('asset'));

      // If the bucket doesn't exist, create it
      if(!assetBucket) {
        assetBucket = Ember.Object.create({
          asset: etf.get('asset'),
          contents: []
        });
        result.pushObject(assetBucket);
      }

      // Push into the bucket
      assetBucket.get('contents').pushObject(etf);
    });

    return result;
  }.property('content.[]', '@each.selected'),

});
