var express = require('express');
var router = express.Router();
var Admin = require('../models/admin'); 
var Ticket = require('../models/ticket');
var Faq = require('../models/faq');
var session = require('express-session');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
   
// Get Homepage
router.get('/login', function(req, res){
	res.render('admin', {layout: false});
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/admin/dashboard');
	}
}

passport.use('login', new LocalStrategy({
  passReqToCallback : true
},
function(req, username, password, done) { 
  // check in mongo if a user with username exists or not
  Admin.findOne({ 'username' :  username }, 
    function(err, admin) {
      // In case of any error, return using the done method
      if (err)
        return done(err);
      // Username does not exist, log error & redirect back
      if (!admin){
        console.log('User Not Found with username '+username);
        return done(null, false, 
              req.flash('message', 'User Not found.'));                 
      }
      // User exists but wrong password, log the error 
      if (!Admin.validPassword(password,admin.password)){
        console.log('Invalid Password');
        return done(null, false, 
            req.flash('message', 'Invalid Password'));
      }
      // User and password both match, return user from 
      // done method which will be treated like success
      return done(null, admin);
      
    }
  )
}));
passport.serializeUser(function(admin, done) {

    done(null, admin.id);  
});
 
passport.deserializeUser(function(id, done) {
  Admin.findById(id, function(err, admin) {
    done(err, admin);
  });
});

router.post('/login', passport.authenticate('login', {
  successRedirect: '/admin/dashboard',
  failureRedirect: '/admin/login',
  failureFlash : true 
}));

router.get('/dashboard', function(req, res){
  res.render('admindashboard');
  console.log(req.user);
});

router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/admin/login');
});

router.get('/tickets',function(req,res){
  Ticket.find({ dept: req.user.department }, function(err, Ticket) {
      if (err) throw err;
      res.render('admindashboard',{
        Tickets:Ticket  
      });
      // object of the ticket
      console.log(req.user);
    });
  
});

router.post('/addfaq', function(req, res){
  var newFaq = new Faq({
   question:req.body.question,
   answer:req.body.answer
});
newFaq.save(function (err) {
    if (err) return console.error(err);
    console.log("your Faq saved");
    res.redirect('/admin/dashboard');
  });
});

router.get('/addfaq', function(req, res){
	res.render('addfaq');
});

router.get('/tickets/detail/:issue_id',function(req,res){
  var id = req.params.issue_id;
  console.log(id);
  Ticket.findById({ _id: id }, function(err, Ticket) {
    if (err) throw err;
    res.render('showdetail',{
      Ticket:Ticket  
    });
    // object of the ticket
    console.log(id);
  });
});
module.exports = router;