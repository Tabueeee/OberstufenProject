"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var smptmail_1 = require("./smptmail");
var Datastore = require('nedb');
var roomDb = new Datastore({ filename: __dirname + '/../data/rooms.json', autoload: true });
var commonIssuesDb = new Datastore({ filename: __dirname + '/../data/commonIssues.json', autoload: true });
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.get('/rooms', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var docs, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4, find(roomDb, {})];
                case 1:
                    docs = _a.sent();
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.send(JSON.stringify(docs));
                    return [3, 3];
                case 2:
                    err_1 = _a.sent();
                    console.log(err_1);
                    res.statusCode = 500;
                    res.send('internal server error.');
                    return [3, 3];
                case 3: return [2];
            }
        });
    });
});
app.get('/commonIssues', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var docs, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4, find(commonIssuesDb, {})];
                case 1:
                    docs = _a.sent();
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.send(JSON.stringify(docs));
                    return [3, 3];
                case 2:
                    err_2 = _a.sent();
                    console.log(err_2);
                    res.statusCode = 500;
                    res.send('internal server error.');
                    return [3, 3];
                case 3: return [2];
            }
        });
    });
});
app.get('/mailGroups', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify([]));
});
app.post('/addCommonIssue', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var commonIssue;
        return __generator(this, function (_a) {
            commonIssue = req.body;
            commonIssuesDb.insert(commonIssue);
            res.send("common issues succsesfully added.");
            return [2];
        });
    });
});
app.post('/sendMail', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var issues, uniqueRecipientsList, _loop_1, _i, uniqueRecipientsList_1, mailRecipient;
        return __generator(this, function (_a) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            issues = req.body;
            uniqueRecipientsList = getUniqueKeys(issues, 'recipients');
            console.log(uniqueRecipientsList);
            _loop_1 = function (mailRecipient) {
                if (mailRecipient !== '') {
                    var issuesForRecipient = issues.filter(function (issue) { return issue.recipients.indexOf(mailRecipient) > -1; });
                    var emailString = generateEmailString(issuesForRecipient);
                    try {
                        smptmail_1.sendMail(emailString, 'Fehlermeldungen fuer den Raum: ' + issuesForRecipient[0].roomId, mailRecipient);
                    }
                    catch (err) {
                        console.log(err);
                        process.exit(0);
                    }
                }
            };
            for (_i = 0, uniqueRecipientsList_1 = uniqueRecipientsList; _i < uniqueRecipientsList_1.length; _i++) {
                mailRecipient = uniqueRecipientsList_1[_i];
                _loop_1(mailRecipient);
            }
            res.send("mails successfully sent.");
            return [2];
        });
    });
});
function getUniqueKeys(array, property) {
    var u = {}, a = [];
    for (var index = 0; index < array.length; ++index) {
        for (var innerIndex = 0; innerIndex < array[index][property].length; ++innerIndex) {
            if (!u.hasOwnProperty(array[index][property][innerIndex])) {
                a.push(array[index][property][innerIndex]);
                u[array[index][property][innerIndex]] = 1;
            }
        }
    }
    return a;
}
function generateEmailString(issues) {
    var emailString = 'Fehlermeldungen fuer den Raum: ' + issues[0].roomId + '\n';
    for (var index = 0; index < issues.length; index++) {
        emailString += generateIssueString(issues[index]);
        if (index !== emailString.length) {
            emailString += '\n=========================\n';
        }
    }
    return emailString;
}
function generateIssueString(issue) {
    var issueString = '' + issue.title + '\n';
    issueString += 'betroffenes Geraet: ' + issue.deviceId + '\n';
    issueString += 'Beschreibung:\n' + issue.description;
    return issueString;
}
function find(db, query) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) {
                    db.find(query, function (err, docs) {
                        if (typeof err !== 'undefined' && err !== null) {
                            reject(err);
                        }
                        resolve(docs);
                    });
                })];
        });
    });
}
app.listen(3000, function () { return console.log('app listening on port 3000!'); });
