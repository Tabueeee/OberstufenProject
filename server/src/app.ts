/// <reference path="../typings/index.d.ts" />

const Datastore = require('nedb');
const roomDb = new Datastore({filename: __dirname + '/../data/rooms.json', autoload: true});
const commonIssuesDb = new Datastore({filename: __dirname + '/../data/commonIssues.json', autoload: true});

let express = require('express');
let app = express();

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

app.post('/sendMail', function (req, res) {
    // let mailInfo = await sendMail();
    res.send(`mail successfully sent to ${mailInfo.envelope.to}`);
});

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
