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

router.post('/login', function (req, res, next) {
  res.locals.db.connect(err => {
    const collection = res.locals.db.db("krkaDB").collection("users");
    collection.findOne({username:req.body.username}, function (err, result) {
      if (err) throw err;
      console.log(result)
      if(!result){
        res.json({'error':'userNotFound'})
      }
      else if(result.password == req.body.password){
        res.json(result)
      }
      else{
        res.json({'error':'wrongPassword'})
      }
    });
  });
});

module.exports = router;
