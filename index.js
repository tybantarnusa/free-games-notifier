'use strict';

require('dotenv').config()
const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new line.Client(config);
const app = express();
const notifier = require('./notifier')

app.get('/', function(req, res){
    res.send("Free Games Notifier v2.0 server");
});

// register a webhook handler with middleware
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

app.post('/notify', (req, res) => {
    const echo = { type: 'text', text: 
        'notify'
    };
    return client.pushMessage('U8c525e435278d45fb1537c0d2b38f62fg', echo)
    .then((result) => res.send("Successfully notified!"))
    .catch((err) => {
        console.error(err);
        res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
    console.log(event);

    if (event.type == 'join') {
        return member.register(event.source);
    }

    else if (event.type == 'leave') {
        return member.unregister(event.source);
    }

    else if (event.message.text == 'debug') {
        return client.replyMessage(event.replyToken, {type: 'text', text: JSON.stringify(event)});
    }

    else {
        return Promise.resolve(null);
    }
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});