var connect = require('connect');

var serveStatic = require('serve-static');

connect().use(
    serveStatic("../Mayordomo.Web")
).listen(6000);

console.log('Server running at http://localhost:6000/');