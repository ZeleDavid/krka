var express = require('express');
var router = express.Router();
var mongo = require('mongodb');

router.get('/all', function (req, res, next) {
    res.locals.db.connect(err => {
      const collection = res.locals.db.db("krkaDB").collection("warehouse");
      collection.find({}).toArray(function (err, result) {
        if (err) throw err;
        res.json(result)
      });
    });
  });

module.exports = router;  