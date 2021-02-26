var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/listUsers', function (req, res, next) {
  res.locals.db.connect(err => {
    const collection = res.locals.db.db("krkaDB").collection("users");
    collection.find({}).toArray(function (err, result) {
      if (err) throw err;
      res.json(result)
    });
  });
});

module.exports = router;
