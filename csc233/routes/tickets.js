var express= require('express');
var session = require('express-session');
var router = express.Router();
var Ticket = require('../models/tickket');

router.get('/',function(req,res){
	res.render('newTicket');
});
router.post('/submit',function(req,res){
    var newTicket = new Ticket({
        username:req.session.username,
        sacId:req.body.sacId,
        issue:req.body.problem,
        dept:req.body.dept,
        status:'In progress'
    });
    newTicket.save(function (err) {
        if (err) return console.error(err);
        console.log("your problem saved");
        res.redirect('/tickets/showTickets');
      });
   
});
router.get('/showTickets',function(req,res){
    Ticket.find({ username: req.session.username }, function(err, Ticket) {
        if (err) throw err;
        res.render('allTickets',{
          Tickets:Ticket  
        });
        // object of the user
        console.log(req.session.username);
      });
    
});
module.exports=router;