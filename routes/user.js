var express = require('express');
var router = express.Router();
var sql = require('../util/connection')
var http = require('http')
var fs = require('fs')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')
var limit = require('express-rate-limit');
const curlRequest = require('curl-request');
const curl = new (require( 'curl-request' ))();

const error = {
    status : 400,
    messsage : "Whoops, something wrong!"
}

const unauthorized = {
    status : 401,
    message : "Back to your lane!!"
}
  

router.get('/profile', (req, res, next) => {
    const id = req.creds.id
    res.render('me', {
        fullname : req.creds.fullname,
        profile : 'http://localhost:13123/user/detail?id='+ id
    })
})

router.get('/detail', (req, res, next) => {

    const id = req.query.id

    sql.query(`select * from user where id=(${id})`, (err, data) => {
        if (err) {
            res.json(error)
            return
        }

        if (data[0].role == 0) {
            res.render('admin',{
                username : data[0].username,
                fullname : data[0].fullname,
                role : data[0].role,
                img : data[0].img
            })

            return
        }

        res.render('detail',{
            username : data[0].username,
            fullname : data[0].fullname,
            role : data[0].role
        })
    })
})

router.post('/pic', async (req, res, next) => {

    console.log(req.body)
    let {imageurl} = req.body

    const danger = ['localhost','127.0.0.1','0.0.0.0']
    danger.forEach(a => {
        if(imageurl.includes(a)) {
            res.json(error)
            return
        }
    });
    const file = fs.createWriteStream("public/images/me.jpeg");
    const request = await http.get(imageurl, function(response) {
        response.pipe(file);
    })

    if (!request) {
        res.json(error)
        return
    }

    res.redirect('http://localhost:13123/user/detail?id=1')

    })

module.exports = router

