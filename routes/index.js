var express = require('express');
var router = express.Router();

/* GET home page. */
// /abc + /cde === /abc/cde
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Express 123456' ,
    products : [{name: 'iphoneX', price: 30000000}, {name: 'A8', price: 10000000}]
  });
});

module.exports = router;
