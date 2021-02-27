var express = require('express');
var router = express.Router();
var mongo = require('mongodb');

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

/* GET user by id*/
router.get('/', function (req, res, next) {
  const collection = res.locals.db.db("krkaDB").collection("users");
  collection.findOne({ _id: mongo.ObjectId(req.body.id) }, function (err, result) {
    if (err) throw err;
    res.json(result)
  })
});
/* GET all users*/
router.get('/all', function (req, res, next) {
  const collection = res.locals.db.db("krkaDB").collection("users");
  collection.find({}).toArray(function (err, result) {
    if (err) throw err;
    res.json(result)
  })
});

/* PUT change password*/
router.put('/password', function (req, res, next) {
  const collection = res.locals.db.db("krkaDB").collection("users");
  var newvalues = { $set: { password: req.body.password } };
  collection.updateOne({ _id: mongo.ObjectId(req.body.id) }, newvalues, function (err, result) {
    if (err) throw err;
    res.json(result)
  })
});

/* POST new User*/
router.post('/', function (req, res, next) {
  const collection = res.locals.db.db("krkaDB").collection("users");
  collection.insertOne(req.body, function (err, result) {
    if (err) throw err;
    res.json(result)
  })
});

/* PUT update User everything but password*/
router.put('/', function (req, res, next) {
  const collection = res.locals.db.db("krkaDB").collection("users");
  var newvalues;
  if (req.body.role == "skladiscnik") {
    newvalues = {
      $set: {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        warehouseID: req.body.warehouseID,
        company: req.body.company
      }
    };
  }
  else if (req.body.role == "dostavljalec") {
    newvalues = {
      $set: {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
      }
    };
  }
  else if (req.body.role == "admin") {
    newvalues = {
      $set: {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
      }
    };
  }

  collection.updateOne({ _id: mongo.ObjectId(req.body.id) }, newvalues, function (err, result) {
    if (err) throw err;
    res.json(result)
  })
});

/* DELETE user*/
router.delete('/:userId', function (req, res, next) {
  var userId = mongo.ObjectId(req.params.userId)
  const collection = res.locals.db.db("krkaDB").collection("users");
  col.deleteOne({ _id: userId }, function (err, res) {
    if (err) throw err;
    console.log("1 document deleted");
    res.json(result)
  });
});

module.exports = router;
