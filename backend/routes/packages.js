var express = require('express');
var router = express.Router();
var fs = require('fs');
const PDFDocument = require('pdfkit');
var nodemailer = require('nodemailer');
var mongo = require('mongodb');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mestniutripmaribor@gmail.com',
    pass: 'mestniutrip1'
  }
});

/* GET users listing. */
router.get('/', function (req, res, next) {
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

router.get('/listUserPackages', function (req, res, next) {
  res.locals.db.connect(err => {
    const collection = res.locals.db.db("krkaDB").collection("package");
    collection.find({ warehouseId: { $exists: true } }).toArray(function (err, result) {
      if (err) throw err;
      res.json(result)
    });
  });
});

router.get('/confirmPackage/:packageId/:userId', function (req, res, next) {
  res.locals.db.connect(err => {
    const collection = res.locals.db.db("krkaDB").collection("package");
    var packageId = mongo.ObjectId(req.params.packageId)
    var userId = mongo.ObjectId(req.params.userId)
    var myquery = { _id: packageId };
    var newvalues = { $set: { status: 'confirmed' } };
    collection.updateOne(myquery, newvalues, function (err, result) {
      if (err) throw err;
      res.json(result)
    });
    const collection2 = res.locals.db.db("krkaDB").collection("users");
    collection2.findOne({ _id: userId }, function (err, result) {
      if (err) throw err;
      console.log(result)
      var mailOptions = {
        from: 'mestniutripmaribor@gmail.com',
        to: result.mail,
        subject: 'Krka podpora',
        text: 'Rezervacija je bila potrjena!'
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    });
  });
});

router.get('/downloadConfirmationPDF', function (req, res, next) {
  const doc = new PDFDocument()
  let filename = "confirmation"
  // Stripping special characters
  filename = encodeURIComponent(filename) + '.pdf'
  // Setting response to 'attachment' (download).
  // If you use 'inline' here it will automatically open the PDF
  res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"')
  res.setHeader('Content-type', 'application/pdf')
  const content = "This is a confirmation!"
  doc.y = 300
  doc.text(content, 50, 50)
  doc.pipe(res)
  doc.end()
});

router.get('/emailConfirmation/:mail', function (req, res, next) {
  // fs.appendFile('public/pdfs/output.txt', 'Hello content!', function (err) {
  //   if (err) throw err;
  //   console.log('Saved!');
  // });
  // var file = fs.createReadStream('./public/pdfs/output.pdf');
  // var stat = fs.statSync('./public/pdfs/output.pdf');
  // res.setHeader('Content-Length', stat.size);
  // res.setHeader('Content-Type', 'application/pdf');
  // res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
  // file.pipe(res);
  var mailOptions = {
    from: 'mestniutripmaribor@gmail.com',
    to: req.params.mail,
    subject: 'Krka podpora',
    text: 'Vaša rezervacija je bila potrjena! Ogledate si jo lahko v priponki tej e-pošti.',
    attachments: [
      {
        filename: 'resnica.pdf',
        path: __dirname + '/../public/pdfs/resnica.pdf'
      }
    ]
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
});

module.exports = router;
