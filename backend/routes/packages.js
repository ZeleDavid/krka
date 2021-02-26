var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/listPackages', function (req, res, next) {
  res.locals.db.connect(err => {
    const collection = res.locals.db.db("krkaDB").collection("package");
    collection.find({}).toArray(function (err, result) {
      if (err) throw err;
      res.json(result)
    });
  });
});

module.exports = router;
