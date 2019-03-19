var notifier = {};

notifier.notify = function(client, event) {
    const echo = { type: 'text', text: 
        'notify'
    };

    return client.pushMessage('U8c525e435278d45fb1537c0d2b38f62fg', echo);  
}

module.exports = notifier;