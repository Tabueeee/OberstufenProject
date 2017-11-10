var Datastore = require('nedb');
var db        = new Datastore({filename: __dirname + '/../rooms.json', autoload: true});
var roomData  = [
    {
        raumName: 'B005',
        raumTyp: 'Sondertyp: 2 Reihen a 6',
        raumBetreuer: 'Schaletzki',
        raumBetreuerMail: 'si@gso-koeln.de'
    },
    {
        raumName: 'B009',
        raumTyp: 'groups',
        raumBetreuer: 'Remmertz',
        raumBetreuerMail: 'rz@gso-koeln.de'
    },
    {
        raumName: 'B022',
        raumTyp: 'Sondertyp: Robotic 6*2',
        raumBetreuer: 'Grob',
        raumBetreuerMail: 'go@gso-koeln.de'
    },
    {
        raumName: 'B109',
        raumTyp: 'circle',
        raumBetreuer: 'Neubert',
        raumBetreuerMail: 'nt@gso-koeln.de'
    },
    {
        raumName: 'B101',
        raumTyp: 'Sondertyp: 2 Reihen Macs Medienproduktion',
        raumBetreuer: 'Neubert',
        raumBetreuerMail: 'nt@gso-koeln.de'
    },
    {
        raumName: 'B111',
        raumTyp: 'circle',
        raumBetreuer: 'Maus',
        raumBetreuerMail: 'ms@gso-koeln.de'
    },
    {
        raumName: 'B113',
        raumTyp: 'circle',
        raumBetreuer: 'Oster',
        raumBetreuerMail: '?@gso-koeln.de'
    },
    {
        raumName: '121',
        raumTyp: 'circle',
        raumBetreuer: 'Meyer',
        raumBetreuerMail: 'my@gso-koeln.de'
    },
    {
        raumName: 'C001',
        raumTyp: 'groups',
        raumBetreuer: 'Bellahn',
        raumBetreuerMail: 'bb@gso-koeln.de'
    },
    {
        raumName: 'C002',
        raumTyp: 'circle',
        raumBetreuer: 'Herwig',
        raumBetreuerMail: 'hg@gso-koeln.de'
    },
    {
        raumName: 'C004',
        raumTyp: 'groups',
        raumBetreuer: 'Frenz',
        raumBetreuerMail: 'fz@gso-koeln.de'
    },
    {
        raumName: 'C007',
        raumTyp: 'groups',
        raumBetreuer: 'Kinold',
        raumBetreuerMail: '?@gso-koeln.de'
    },
    {
        raumName: 'C013',
        raumTyp: 'groups',
        raumBetreuer: 'Poller',
        raumBetreuerMail: 'po@gso-koeln.de'
    },
    {
        raumName: 'C015',
        raumTyp: 'groups',
        raumBetreuer: 'Bunte',
        raumBetreuerMail: 'be@gso-koeln.de'
    },
    {
        raumName: 'C017',
        raumTyp: 'circle',
        raumBetreuer: 'Körperich',
        raumBetreuerMail: 'kh@gso-koeln.de'
    },
    {
        raumName: 'C021',
        raumTyp: 'circle',
        raumBetreuer: 'Neitzel',
        raumBetreuerMail: 'nl@gso-koeln.de'
    },
    {
        raumName: 'C023',
        raumTyp: 'groups',
        raumBetreuer: 'Sielemann',
        raumBetreuerMail: 'sm@gso-koeln.de'

    },
    {
        raumName: 'C025',
        raumTyp: 'groups',
        raumBetreuer: 'Rüffer',
        raumBetreuerMail: 'ru@gso-koeln.de'
    },
    {
        raumName: 'C103',
        raumTyp: 'circle',
        raumBetreuer: 'Steinstrass',
        raumBetreuerMail: 'st@gso-koeln.de'
    },
    {
        raumName: 'C105',
        raumTyp: 'circle',
        raumBetreuer: 'Düchting-Lauten',
        raumBetreuerMail: 'dl@gso-koeln.de'
    },
    {
        raumName: 'UA01',
        raumTyp: 'angled',
        raumBetreuer: 'Lackmann',
        raumBetreuerMail: 'ln@gso-koeln.de'
    }
];


var rooms = [
    "A002",
    "A103",
    "A108",
    "B001",
    "B003",
    "B005",
    "B009",
    "B011",
    "B013",
    "B017",
    "B019",
    "B021",
    "B022",
    "B101",
    "B103",
    "B105",
    "B109",
    "B111",
    "B113",
    "B117",
    "B119",
    "B121",
    "B122",
    "B124",
    "C001",
    "C002",
    "C004",
    "C005",
    "C007",
    "C013",
    "C015",
    "C017",
    "C021",
    "C023",
    "C025",
    "C101",
    "C102",
    "C103",
    "C105",
    "C106",
    "C108",
    "C110",
    "C114",
    "C116",
    "C118",
    "C122",
    "C124",
    "C126",
    "D001",
    "SPA1",
    "SPA2",
    "SPA3",
    "SPO1",
    "SPO2",
    "SPO3",
    "UA01",
    "UA02",
    "UA11",
    "UA12",
    "UB01",
    "UB03",
    "UB04",
    "W",
    "X",
    "Y",
    "Z"
];
rooms.forEach(function (roomName) {
    var wing  = roomName.substr(0, 1);
    var floor = roomName.substr(1, 1);


    var currentRoomData = roomData.filter(function (currentRoom) {
        return currentRoom.raumName === roomName;
    });

    if (currentRoomData.length === 1 && ['circle', 'groups', 'angled'].indexOf(currentRoomData[0].raumTyp) !== -1) {
        var room = {
            wing: wing,
            floor: floor,
            layout: currentRoomData[0].raumTyp,
            roomId: roomName,
            contact: currentRoomData[0].raumBetreuer,
            contactMail: currentRoomData[0].raumBetreuerMail
        };

        db.insert(room);
    }

});
