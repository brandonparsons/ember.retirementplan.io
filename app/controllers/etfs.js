import Ember from 'ember';

export default Ember.ArrayController.extend({

  groupedBySecurity: function() {
    var result = [];

    this.forEach( function(etf) {
      var securityBucket = result.findBy('security', etf.get('security'));

      // If the bucket doesn't exist, create it
      if(!securityBucket) {
        securityBucket = Ember.Object.create({
          security: etf.get('security'),
          contents: []
        });
        result.pushObject(securityBucket);
      }

      // Push into the bucket
      securityBucket.get('contents').pushObject(etf);
    });

    return result;
  }.property('content.[]', '@each.selected'),

});
