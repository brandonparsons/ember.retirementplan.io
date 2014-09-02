import Ember from 'ember';

export default Ember.ArrayController.extend({

  groupedByAsset: function() {
    var assetGroups = [];
    this.forEach( function(etf) {
      var assetBucket = assetGroups.findBy('asset', etf.get('asset'));
      if(!assetBucket) { // If the bucket doesn't exist, create it
        assetBucket = Ember.Object.create({
          asset: etf.get('asset'),
          etfsInGroup: []
        });
        assetGroups.pushObject(assetBucket);
      }
      assetBucket.get('etfsInGroup').pushObject(etf); // Push this etf into the bucket
    });
    return assetGroups;
  }.property('@each.asset'),

});
