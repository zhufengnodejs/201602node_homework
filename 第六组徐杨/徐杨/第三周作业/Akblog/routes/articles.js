/**
 * Created by Akesure on 16-4-25.
 */
var express = require('express');
var router = express.Router();

router.get('/add', function(req, res){
    res.render('articles/add', {title : '发表文章'});
});

router.post('/add', function(req, res){

});

module.exports = router;