var express = require('express');
var router = express.Router();
var sql = require('../util/connection')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')
var limit = require('express-rate-limit');

router.post('/', (req, res, next) => {

    console.log(req.body)
    let {imageurl} = req.body

    sql.query(`update user set img='${imageurl}') where id=1`, (err, data) => {
        if (err) {
            // return res.json(unauthorized)
            console.log(err)
        }
        res.render('admin',{
            username : req.creds.username,
            fullname : req.creds.fullname,
            role : req.creds.role
        })
    })
})


module.exports = router
