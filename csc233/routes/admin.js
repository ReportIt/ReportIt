var express = require('express');
var router = express.Router();
var Admin = require('../models/admin'); 
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
  res.render('admindashboard', {layout: false});
  console.log(req.user);
});

router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/admin/login');
});

module.exports = router;