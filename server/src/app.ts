/// <reference path="../typings/index.d.ts" />

import {sendMail} from './smptmail';

const Datastore = require('nedb');
const roomDb = new Datastore({filename: __dirname + '/../data/rooms.json', autoload: true});
const commonIssuesDb = new Datastore({filename: __dirname + '/../data/commonIssues.json', autoload: true});

let express = require('express');
let app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // to support JSON-encoded bodies

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});


app.get('/rooms', async function (req, res) {
    try {
        let docs = await find(roomDb, {});
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(JSON.stringify(docs));
    } catch (err) {
        console.log(err);
        res.statusCode = 500;
        res.send('internal server error.');
    }
});

app.get('/commonIssues', async function (req, res) {
    try {
        let docs = await find(commonIssuesDb, {});
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(JSON.stringify(docs));
    } catch (err) {
        console.log(err);
        res.statusCode = 500;
        res.send('internal server error.');
    }
});

app.get('/mailGroups', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify([]));
});

app.post('/addCommonIssue', function (req, res) {
    let commonIssue = req.body;
    commonIssuesDb.insert(commonIssue);
    res.send(`common issues succsesfully added.`);
});

app.post('/sendMail', async function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let issues = req.body;

    let uniqueRecipientsList = getUniqueKeys(issues, 'recipients');
    console.log(uniqueRecipientsList);
    for (let mailRecipient of uniqueRecipientsList) {
        if (mailRecipient !== '') {
            let issuesForRecipient = issues.filter((issue) => issue.recipients.indexOf(mailRecipient) > -1);
            let emailString = generateEmailString(issuesForRecipient);
            console.log(emailString);
            let mailInfo = await sendMail(emailString, 'Fehlermeldungen fuer den Raum: ' + issuesForRecipient[0].roomId, mailRecipient);

            if (typeof mailInfo === 'string') {
                // handle failure
            }
        }
    }

    res.send(`mails successfully sent.`);
});

function getUniqueKeys(array, property) {
    let u = {}, a = [];
    for (let index = 0; index < array.length; ++index) {
        for (let innerIndex = 0; innerIndex < array[index][property].length; ++innerIndex) {
            if (!u.hasOwnProperty(array[index][property][innerIndex])) {
                a.push(array[index][property][innerIndex]);
                u[array[index][property][innerIndex]] = 1;
            }
        }

    }

    return a;
}

function generateEmailString(issues) {
    let emailString = 'Fehlermeldungen fuer den Raum: ' + issues[0].roomId + '\n';

    for (let index = 0; index < issues.length; index++) {
        emailString += generateIssueString(issues[index]);

        if (index !== emailString.length) {
            emailString += '\n=========================\n';
        }
    }

    return emailString;
}

function generateIssueString(issue) {
    let issueString = '' + issue.title + '\n';
    issueString += 'betroffenes Geraet: ' + issue.deviceId + '\n';
    issueString += 'Beschreibung:\n' + issue.description;

    return issueString;
}

async function find(db, query) {
    return new Promise(function (resolve, reject) {
        db.find(query, function (err, docs) {
            if (typeof err !== 'undefined' && err !== null) {
                reject(err);
            }
            resolve(docs);
        });
    });
}

app.listen(3000, () => console.log('app listening on port 3000!'));
