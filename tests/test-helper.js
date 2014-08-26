import Ember from 'ember';
import resolver from './helpers/resolver';
import { setResolver } from 'ember-qunit';

setResolver(resolver);

document.write('<div id="ember-testing-container"><div id="ember-testing"></div></div>');

QUnit.config.urlConfig.push({ id: 'nocontainer', label: 'Hide container'});
if (QUnit.urlParams.nocontainer) {
  document.getElementById('ember-testing-container').style.visibility = 'hidden';
} else {
  document.getElementById('ember-testing-container').style.visibility = 'visible';
}

function exists(selector) {
  return !!find(selector).length;
}

function textMatches(selector, text) {
  var message = "The text matches expectations on " + selector;
  equal(find(selector).text(), text, message);
}

function correctNumberItems(selector, length) {
  var message = "The number of items matches expectations on " + selector;
  equal(find(selector).length, length, message);
}

var testing = function(app) {
  var helper = {
    container: function() {
      return app.__container__;
    },
    store: function() {
      return helper.container().lookup("store:main");
    },
    controller: function(name) {
      return helper.container().lookup("controller:" + name);
    },
    path: function() {
      return helper.controller('application').get('currentPath');
    }
  };

  return helper;
};

Ember.Test.registerHelper('path', function(app) {
  return testing(app).path();
});

Ember.Test.registerHelper('store', function(app) {
  return testing(app).store();
});

Ember.Test.registerHelper('currentUser', function(app) {
  return testing(app).controller('user.current');
});
