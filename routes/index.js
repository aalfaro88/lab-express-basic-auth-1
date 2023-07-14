var express = require('express');
var router = express.Router();

const isLoggedIn =require ('../middleware/isLoggedIn')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/main', isLoggedIn, (req, res, next) => {
  res.render('catPage.hbs')
})

router.get('/private', isLoggedIn, (req, res, next) => {
  res.render('gifPage.hbs')
})

module.exports = router;
