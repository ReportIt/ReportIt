var express = require('express');
var router = express.Router();
var Faq=require('../models/faq')

// Get Homepage
router.get('/', function(req, res){
    Faq.find({}, function(err, Faq) {
        if (err) throw err;
        res.render('FAQ',{
          Faqs:Faq  
        });
        // object of the user
        console.log(req.session.username);
      });
});

module.exports = router;