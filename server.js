var express = require('express');

var app = express();
var port = process.env.PORT || 3000;

app.get('/', function (req, res) {
    res.send('Hello Facebook Messenger!');
});

app.listen(port, function () {
    console.log('Server listening at port %s', port);
});