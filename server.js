var express = require('express');

var app = express();
var port = process.env.PORT || 3000;

app.get('/', function (req, res) {
    res.send('Hello Facebook Messenger!');
});

app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'verify_token_facebook_messenger') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Error, wrong validation token');
    }
});

app.listen(port, function () {
    console.log('Server listening at port %s', port);
});