var connect = require('connect');

var serveStatic = require('serve-static');

connect().use(
    serveStatic("../web")
).listen(5000);

console.log('Server running at http://localhost:5000/');