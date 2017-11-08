var Datastore = require('nedb');
var db        = new Datastore({filename: __dirname + '/commonIssues.json', autoload: true});



var commonIssuesByName = [
    {
        title: 'Maus defekt',
        description: 'Die Maus des Gerätes #%deviceId% ist defekt.',
        additionalRecipients: []
    },
    {
        title: 'Tastatur defekt',
        description: 'Tastatur defekt',
        additionalRecipients: []
    },
    {
        title: 'Monitor defekt',
        description: 'Monitor defekt',
        additionalRecipients: []
    },
    {
        title: 'Rechner defekt',
        description: 'Rechner defekt',
        additionalRecipients: []
    },
    {
        title: 'Netzwerkkabel defekt',
        description: 'Netzwerkkabel defekt',
        additionalRecipients: []
    },
    {
        title: 'Software defekt',
        description: 'Software defekt',
        additionalRecipients: []
    }
];




commonIssuesByName.forEach(function (issue) {
    db.insert(issue);
});








