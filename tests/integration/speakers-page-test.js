// // DONT HAVE PRETENDER WORKING

// import Ember from 'ember';
// import startApp from 'retirement-plan/tests/helpers/start-app';
// import Pretender from 'vendor/pretender';

// var App, server;

// // Helper function from https://github.com/eviltrout/login/commit/96ea107cc79ddb27d649aa9c8b8990bbd0ce04b6
// function parsePostData(query) {
//   var result = {};
//   query.split("&").forEach(function(part) {
//     var item = part.split("=");
//     result[item[0]] = decodeURIComponent(item[1]);
//   });
//   return result;
// }
// // Usage
// this.post("/session", function(request) {
//   var data = parsePostData(request.requestBody);
//   if (data.password === "secret") {
//     ......


// module('Integration - Speaker Page', {
//   setup: function() {
//     App = startApp();
//     var speakers = [
//       {
//         id: 1,
//         name: 'Bugs Bunny'
//       },
//       {
//         id: 2,
//         name: 'Wile E. Coyote'
//       },
//       {
//         id: 3,
//         name: 'Yosemite Sam'
//       }
//     ];

//     server = new Pretender(function() {
//       this.get('/api/v1/speakers', function(request) {
//         return [200, {"Content-Type": "application/json"}, JSON.stringify({speakers: speakers})];
//       });

//       this.get('/api/v1/speakers/:id', function(request) {
//         var speaker = speakers.find(function(speaker) {
//           if (speaker.id === parseInt(request.params.id, 10)) {
//             return speaker;
//           }
//         });

//         return [200, {"Content-Type": "application/json"}, JSON.stringify({speaker: speaker})];
//       });
//     });

//   },
//   teardown: function() {
//     Ember.run(App, 'destroy');
//     server.shutdown();
//   }
// });

// test('Should allow navigation to the speakers page from the landing page', function() {
//   visit('/').then(function() {
//     click('a:contains("Speakers")').then(function() {
//       equal(find('h3').text(), 'Speakers');
//     });
//   });
// });

// test('Should list all speakers', function() {
//   visit('/speakers').then(function() {
//     equal(find('a:contains("Bugs Bunny")').length, 1);
//     equal(find('a:contains("Wile E. Coyote")').length, 1);
//     equal(find('a:contains("Yosemite Sam")').length, 1);
//   });
// });

// test('Should be able to navigate to a speaker page', function() {
//   visit('/speakers').then(function() {
//     click('a:contains("Bugs Bunny")').then(function() {
//       equal(find('h4').text(), 'Bugs Bunny', 'Can find Bugs Bunny on the page');
//     });
//   });
// });

// test('Should be able visit a speaker page', function() {
//   visit('/speakers/1').then(function() {
//     equal(find('h4').text(), 'Bugs Bunny');
//   });
// });
