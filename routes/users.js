var express = require('express');
var router = express.Router();

//TODO------------DB---------------------
const User = require('../model/user')
const Customer = require('../model/customer')
const Admin = require('../model/admin')

//TODO-----------validator------------------
const {body,validationResult} = require('express-validator')

//TODO------------passport-----------------------------------
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy


//*---------------------------------------------------------------------------------------------------
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//TODO----------Register----------------------
router.get('/register', function(req, res, next) {
  res.render('users/register');
});

router.get('/login', function(req, res, next) {
  res.render('users/login');
});

//TODO------------------Register -------บันทีกข้อมูล----------------------------------------------
router.post('/register',body('username','กรุณาระบุ Username').not().isEmpty(),
                        body('password','กรุณาระบุ Password').not().isEmpty(),
                        body('email','กรุณาระบุ Email').isEmail(),
                        body('fname','กรุณาระบุ fname').not().isEmpty(),
                        body('lname','กรุณาระบุ lname').not().isEmpty(),
                        async function(req, res, next) {
    const result = validationResult(req)
    const errors = result.errors
    
    
    if(!result.isEmpty()){
      res.render('users/register',{errors:errors})
    }else{
      var username=req.body.username;
      var type=req.body.type;
      var fname=req.body.fname;
      var lname=req.body.lname;
      var email=req.body.email;
      var password=req.body.password;

      const newUser = new User({
        username:username,
        password:password,
        email:email,
        type:type
      })

      if(type=='customer'){
        let newCustomer = new Customer({
                    username:username,
                    email:email,
                    fname:fname,
                    lname:lname    
                  })
        await User.saveCustomer(newUser,newCustomer)
      }else {
        let newAdmin = new Admin({
                    username:username,
                    email:email,
                    fname:fname,
                    lname:lname    
                  })
        await User.saveAdmin(newUser,newAdmin)
      }
    res.redirect('/')
    }
});
//*------------------Register -------บันทีกข้อมูล----------------------------------------------

//TODO------------------Login -------เข้าสู่ระบบ----------------------------------------------
router.post('/login',passport.authenticate('local',{
                    failureRedirect:'/users/login',
                    failureFlash:true,
                    
              }),function(req, res, next) {
                req.flash('success','เข้าสู่ระบบสำเร็จ')
                var userType = req.user.type
                res.redirect('/'+userType+'s/home')
});

passport.serializeUser((user,done)=>{
  done(null,user.id)
})

passport.deserializeUser((id,done)=>{
  User.getUserById(id,(err,user)=>{
    done(err,user)
  })
  
 
})

passport.use(new LocalStrategy((username,password,done)=>{
 
  //*(1)เปรียบเทียบชื่อ------------------------
  User.getUserByName(username,(err,user)=>{
    if(err) throw err
    if(!user){
      return done(null,false)
    }
  //*(2)เปรียบเทียบรหัสผ่าน-----------------------
    User.comparePassword(password,user.password,(err,isMatch)=>{
      if(err) throw err
      console.log(isMatch)
      if(isMatch){
        console.log(user)
        return done(null,user)
      }else{
        return done(null,false)
      }
    })
  })
}))
//*----------------------Login----------------------------------------------------

//TODO------------------Logout -------------------------------------------------
router.get('/logout',(req,res,next)=>{
  req.logOut()
  res.redirect('/users/login')
})
//*----------Logout---------------------

module.exports = router;
