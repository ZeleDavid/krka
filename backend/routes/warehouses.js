var express = require('express');
var router = express.Router();
var mongo = require('mongodb');

/* Get all warehouses */
router.get('/all', function (req, res, next) {
    res.locals.db.connect(err => {
        const collection = res.locals.db.db("krkaDB").collection("warehouse");
        collection.find({}).toArray(function (err, result) {
            if (err) throw err;
            res.json(result)
        });
    });
});

/* Get warehouse by package number */
router.get('/check/:packageNumber', function (req, res, next) {
    var stevilka = parseInt(req.params.packageNumber/1000)*1000
    res.locals.db.connect(err => {
        const collection = res.locals.db.db("krkaDB").collection("warehouse");
        collection.findOne({id_for_packages: stevilka}, function (err, result) {
            if (err) throw err;
            res.json(result)
        });
    });
});

/* GET warehouse by id */
router.get('/', function (req, res, next) {
    res.locals.db.connect(err => {
        const collection = res.locals.db.db("krkaDB").collection("warehouse");
        collection.findOne({ _id: mongo.ObjectID(req.body.id) }, function (err, result) {
            if (err) throw err;
            res.json(result)
        });
    });
});

/* POST create new warehouse */
router.post('/', function (req, res, next) {
    res.locals.db.connect(err => {
        const collection = res.locals.db.db("krkaDB").collection("warehouse");
        collection.insertOne(req.body, function (err, result) {
            if (err) throw err;
            res.json(result)
        });
    });
});

/* POST add termin to warehouse */
router.post('/:id/termin', function (req, res, next) {
    res.locals.db.connect(err => {
        const collection = res.locals.db.db("krkaDB").collection("warehouse");
        var newvalues = { $push: { dates: req.body } }
        collection.updateOne({ _id: mongo.ObjectID(req.params.id) }, newvalues, function (err, result) {
            if (err) throw err;
            res.json(result)
        });
    });
});

/* POST add termin to warehouse from daterange 2021-02-25*/
router.post('/:id/termin/:startDate/:endDate', function (req, res, next) {

    var startDate = new Date(req.params.startDate);
    var endDate = new Date(req.params.endDate);

    var startTime = startDate.getTime();
    var endTime = endDate.getTime();

    var dates = []
    while (startTime <= endTime) {
        var date = {
            date: new Date(startTime),
            isFree: true
        }
        dates.push(date);
        startTime += 1800000;
    }

    res.locals.db.connect(err => {
        const collection = res.locals.db.db("krkaDB").collection("warehouse");
        var newvalues = { $push: { dates: { $each: dates } } }
        collection.updateOne({ _id: mongo.ObjectID(req.params.id) }, newvalues, function (err, result) {
            if (err) throw err;
            res.json(result)
        });
    });
});

/* PUT book termin*/
router.post('/:id/:termin', function (req, res, next) {

    var newvalue = { $set: { "dates.$.isFree": false, "dates.$.location": req.body.location } }
    res.locals.db.connect(err => {
        const collection = res.locals.db.db("krkaDB").collection("warehouse");
        collection.updateOne(
            { _id: mongo.ObjectID(req.params.id), "dates.date": new Date(new Date(req.params.termin).getTime()) },
            newvalue,
            function (err, result) {
                if (err) throw err;
                res.json(result)
            });
    });
});


module.exports = router;  