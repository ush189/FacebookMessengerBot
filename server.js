var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 3000;

var pageAccessToken = 'EAAIJf2PGBwIBACpZBwQNFi7QslU70YbQZAVIZCGUSnk0G8eI9ZBWMuIZCSnvYVvKKV0xviQ6QRmI1rHcFsbgZCcaZBNYZCKX1gjjZC1vnbFj9VCP7UMXHruWruqtWhB0y3wGLXnMwsR8bFCaZBDF5l9mmwcZAyYOVAsRDgzZC0fSyzBzFgZDZD';

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
        var senderId = event.sender.id;

        console.log(event);
        if (event.message && event.message.text) {
            sendTextMessage(senderId, event.message.text);

            var options = [
                {
                    title: "Gut",
                    payload: "FEELING_GOOD"
                },
                {
                    title: "Muss ja...",
                    payload: "FEELING_BAD"
                }
            ];
            sendButtonMessage(senderId, "Wie geht es dir?", options);
        } else if (event.postback && event.postback.payload) {
            console.log(event.postback.payload);
            switch (event.postback.payload) {
                case "FEELING_GOOD":
                    sendTextMessage(senderId, "Das freut mich!");
                    break;
                case "FEELING_BAD":
                    sendTextMessage(senderId, "Oh, schade :(");
                    break;
            }
        }
    }

    res.sendStatus(200);
});

app.listen(port, function() {
    console.log('Server listening at port %s', port);
});

function sendTextMessage(senderId, text) {
    var message = {
        text: text
    };

    sendMessage(senderId, message);
}

function sendButtonMessage(senderId, title, options) {
    console.log(senderId, title, options);
    var buttons = [];
    options.forEach(function(option) {
        buttons.push({
            type: "postback",
            title: option.title,
            payload: option.payload
        });
    });
    console.log(buttons);

    var message = {
        "attachment": {
            "type":"template",
            "payload": {
                "template_type": "button",
                "text": title,
                "buttons": buttons
            }
        }
    };

    sendMessage(senderId, message);
}

function sendMessage(senderId, message) {
    request.post({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: pageAccessToken
        },
        json: {
            recipient: {
                id: senderId
            },
            message: message
        }
    }, function(error, response) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}