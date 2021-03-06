var express = require('express');
var router = express.Router();
var sql = require('../util/connection')
var jwt = require('jsonwebtoken')

/* GET users listing. */

const error = {
  status : 400,
  message: "hahahaha"
}

const unauthorized = {
  status : 401,
  message: "Back to ur lane!!"
}

router.post('/register', (req, res, next) => {
  let {
    username,
    password,
    fullname
  } = req.body

  const user = sql.escape(username)
  const pass = sql.escape(password)
  const full = sql.escape(fullname)
  sql.query(`INSERT INTO user (username, password, fullname, role) VALUES(${user}, ${pass}, ${full},2)`, (err, data) => {
    if (err) res.json(error)
    res.json({
      status  : 200, 
      message : "Data created",
    })
  })
})

router.post('/login', (req, res, next) => {
    let {username, password} = req.body
    let user = sql.escape(username)
    let pass = sql.escape(password)
    
    sql.query(`SELECT * FROM user where username=${user} AND password=${pass}`, (err, rows) => {
      if (err) return res.json(error)
      if (rows.length == 0) return res.render('login')
      const token = "Bearer " + jwt.sign({id : rows[0].id , username : rows[0].username, fullname : rows[0].fullname,role : rows[0].role },"linkensphere")

      res.cookie('x-auth-token', token)
      res.redirect('/user/profile')
      
    }) 
})

module.exports = router;
