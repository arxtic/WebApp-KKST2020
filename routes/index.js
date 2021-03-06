var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')

const unauthorized = {
  status : 401,
  message : "Back to your lane!!"
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'LETS JAMING',
    img : req.baseUrl + '/images/file.jpg' 
  });
});

// Frontend 

router.get('/admin', (req, res, next) => {
    res.render('login')
})

router.get('/register', (req, res, next) => {
  res.render('register')
}) 

router.get('/logout', (req,res,next) => {
  res.clearCookie('x-auth-token')
  res.redirect('/admin')
})

module.exports = router;
