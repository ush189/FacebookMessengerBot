var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('Hello Facebook Messenger!');
});

app.get('/webhook', function(req, res) {
    if (req.query['hub.verify_token'] === 'verify_token_facebook_messenger') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Error, wrong validation token');
    }
});

app.get('/subscribe', function(req, res) {
    var pageAccessToken = 'EAAIJf2PGBwIBACpZBwQNFi7QslU70YbQZAVIZCGUSnk0G8eI9ZBWMuIZCSnvYVvKKV0xviQ6QRmI1rHcFsbgZCcaZBNYZCKX1gjjZC1vnbFj9VCP7UMXHruWruqtWhB0y3wGLXnMwsR8bFCaZBDF5l9mmwcZAyYOVAsRDgzZC0fSyzBzFgZDZD';
    request.post('https://graph.facebook.com/v2.6/me/subscribed_apps?access_token=' + pageAccessToken, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        } else {
            res.send('Error, wrong page access token');
        }
    });
});

app.post('/webhook/', function (req, res) {
    var messagingEvents = req.body.entry[0].messaging;

    for (var i = 0; i < messagingEvents.length; i++) {
        var event = req.body.entry[0].messaging[i];
        if (event.message && event.message.text) {
            var text = event.message.text;
            // Handle a text message from this sender
            console.log(text);
        }
    }

    res.sendStatus(200);
});

app.listen(port, function() {
    console.log('Server listening at port %s', port);
});