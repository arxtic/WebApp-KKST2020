var express = require('express');
var router = express.Router();
var sql = require('../util/connection')
var fs = require('fs')
var needle = require('needle')

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
        profile : '/user/detail?id='+ id
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
                img : 'http://' + req.get('host') + '/images/me.jpeg'
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
    const file = fs.createWriteStream("public/images/me.jpeg");
    const request = await needle.get(imageurl).pipe(file).on('done', function() {
        console.log('done');    
    });

    console.log(request)

    if (!request) {
        res.json(error)
        return
    }

    res.redirect('/user/detail?id=1')

    })

module.exports = router

