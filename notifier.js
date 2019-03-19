var notifier = {};

notifier.notify = function(client, event) {
    const echo = { type: 'text', text: 
        event.message.text 
    };

    return client.pushMessage('U8c525e435278d45fb1537c0d2b38f62f', echo);  
}

module.exports = notifier;