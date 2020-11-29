var express = require('express');
var router = express.Router();
var sql = require('../util/connection')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')
var limit = require('express-rate-limit')


const unauthorized = {
    status : 401,
    message : "Back to your lane!!"
}

const error = {
    status : 400,
    messsage : "Whoops, something wrong!"
}

router.get('/me', (req, res, next) => {
    if (!req.headers['x-auth-token']) {
        res.json(unauthorized)
        return
   }
   const auth = req.headers['x-auth-token']
   const token  = auth.split(" ")
   const creds = jwt.decode(token[1])

   res.json(creds)
})

router.get('/list', (req, res, next) =>  {
    if (!req.headers['x-auth-token']) {
         res.json(unauthorized)
         return
    }
    const auth = req.headers['x-auth-token']
    const token  = auth.split(" ")
    const creds = jwt.decode(token[1])

    if (creds.role != 0) {
        res.json(unauthorized)
        return
   }

   sql.query('SELECT id, username, role FROM user', (err, data) => {
        if (err) return err
        res.json({
            status : 200,
            message : "Success!",
            data : data
        })
   })

});

router.get('/list/detail', (req, res, next) => {
    if (!req.headers['x-auth-token']) {
        res.json(unauthorized)
        return
    }
    const auth = req.headers['x-auth-token']
    const token  = auth.split(" ")
    const creds = jwt.decode(token[1])

    if (creds.role != 0) {
        res.json(unauthorized)
        return
    }
    
    const id = req.query.id

    sql.query(`select id,username,role from user where id=(${id})`, (err, data) => {
        if (err) {
            res.json(error)
            return
        }

        res.json({
            status : 200,
            message : "Success",
            data : data
        })
    })
})

module.exports = router

