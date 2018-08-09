var connect = require('connect');
var path = require('path');
var app = connect().use(connect.static('./angularjsStudy/products'));
app.listen(5000);
