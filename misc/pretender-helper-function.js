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
