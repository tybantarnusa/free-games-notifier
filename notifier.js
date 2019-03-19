var notifier = {};

notifier.notify = function(client, event) {
    const echo = { type: 'text', text: event.message.text };

    return client.replyMessage(event.replyToken, echo);  
}

module.exports = notifier;