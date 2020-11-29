var express = require('express');
var router = express.Router();
var sql = require('../util/connection')
var jwt = require('jsonwebtoken')

/* GET users listing. */

router.post('/register', (req, res, next) => {
  let {
    username,
    password
  } = req.body

  const user = sql.escape(username)
  const pass = sql.escape(password)
  sql.query(`INSERT INTO user (username, password, role) VALUES(${user}, ${pass}, 2)`, (err, data) => {
    if (err) return err
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
      if (err) console.log(err)
      if (!rows) return res.render('login')
      const token = jwt.sign({id : rows[0].id , username : rows[0].username, role : rows[0].role},"linkenSpher3!")
      res.json({
        status : 200,
        message: "Logged in",
        token : `Bearer ${token}`
      })
    }) 
})

module.exports = router;
