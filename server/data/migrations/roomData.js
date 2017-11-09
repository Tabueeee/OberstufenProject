let roomData = [[
    {
        raumName: 'B005',
        raumTyp: 'Sondertyp: 2 Reihen a 6',
        raumBetreuer: 'Schaletzki',
        raumBetreuerMail: 'si@gso-koeln.de'
    },
    {
        raumName: 'B009',
        raumTyp: 'Block',
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
        raumTyp: 'Kreis',
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
        raumTyp: 'Kreis',
        raumBetreuer: 'Maus',
        raumBetreuerMail: 'ms@gso-koeln.de'
    },
    {
        raumName: 'B113',
        raumTyp: 'Kreis',
        raumBetreuer: 'Oster',
        raumBetreuerMail: '?@gso-koeln.de'
    },
    {
        raumName: '121',
        raumTyp: 'Kreis',
        raumBetreuer: 'Meyer',
        raumBetreuerMail: 'my@gso-koeln.de'
    },
    {
        raumName: 'C001',
        raumTyp: 'Block',
        raumBetreuer: 'Bellahn',
        raumBetreuerMail: 'bb@gso-koeln.de'
    },
    {
        raumName: 'C002',
        raumTyp: 'Kreis',
        raumBetreuer: 'Herwig',
        raumBetreuerMail: 'hg@gso-koeln.de'
    },
    {
        raumName: 'C004',
        raumTyp: 'Block',
        raumBetreuer: 'Frenz',
        raumBetreuerMail: 'fz@gso-koeln.de'
    },
    {
        raumName: 'C007',
        raumTyp: 'Block',
        raumBetreuer: 'Kinold',
        raumBetreuerMail: '?@gso-koeln.de'
    },
    {
        raumName: 'C013',
        raumTyp: 'Block',
        raumBetreuer: 'Poller',
        raumBetreuerMail: 'po@gso-koeln.de'
    },
    {
        raumName: 'C015',
        raumTyp: 'Block',
        raumBetreuer: 'Bunte',
        raumBetreuerMail: 'be@gso-koeln.de'
    },
    {
        raumName: 'C017',
        raumTyp: 'Kreis',
        raumBetreuer: 'Körperich'  ,
        raumBetreuerMail: 'kh@gso-koeln.de'
    },
    {
        raumName: 'C021',
        raumTyp: 'Kreis',
        raumBetreuer: 'Neitzel',
        raumBetreuerMail: 'nl@gso-koeln.de'
    },
    {
        raumName: 'C023',
        raumTyp: 'Block',
        raumBetreuer: 'Sielemann',
        raumBetreuerMail: 'sm@gso-koeln.de'

    },
    {
        raumName: 'C025',
        raumTyp: 'Block',
        raumBetreuer: 'Rüffer',
        raumBetreuerMail: 'ru@gso-koeln.de'
    },
    {
        raumName: 'C103',
        raumTyp: 'Kreis',
        raumBetreuer: 'Steinstrass' ,
        raumBetreuerMail: 'st@gso-koeln.de'
    },
    {
        raumName: 'C105',
        raumTyp: 'Kreis',
        raumBetreuer: 'Düchting-Lauten',
        raumBetreuerMail: 'dl@gso-koeln.de'
    },
    {
        raumName: 'UA01',
        raumTyp: 'BlockUsinger',
        raumBetreuer: 'Lackmann',
        raumBetreuerMail: 'ln@gso-koeln.de'
    }
];



roomData.forEach(function (room) {

    db.find({"roomid": room.roomId}, function (err, rooms) {
        if (err || rooms.length !== 1) {
            throw err;
        }
        var room = rooms[0];
        if (update === true) {
            db.update({"roomid": roomId}, {
                wing: room.wing,
                floor: room.floor,
                layout: layout,
                roomid: room.roomid,
                _id: room._id
            }, function (err, numAffected) {
                if (!err) {
                    console.log('successfully updated ' + numAffected + ' items.');
                }
            });
        } else {
            console.log(room);
        }
    });

})
