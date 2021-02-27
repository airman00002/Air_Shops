var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var customersRouter = require('./routes/customers');
var adminsRouter = require('./routes/admins');



const port = process.env.PORT || 3000;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')
const stripe = require('stripe')('sk_test_51I5CPxHXfE95nDyQ1itv6H8A6t0I0booJP1e1Iq9RGg2Af2n8Fb792SPS2dE11sEbdBF2DrTJC9dfY4JyTLwkxD100dBNaaxFG')

const Order = require('./model/order')

var app = express();

//TODO-------------session-------------------------
app.use(session({
  secret: 'keyboard cat',
  resave:false,
  saveUninitialized:true
}))

//TODO--------messages----------------
app.use(require('connect-flash')())
app.use((req,res,next)=>{
  res.locals.messages = require('express-messages')(req,res)
  next()
})


//TODO--------passport----------------
app.use(passport.initialize())
app.use(passport.session())
//*--------passport----------------

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//TODO--------local user------------------------------
app.get('*',(req,res,next)=>{
  res.locals.user = req.user || null
  next()
})

//TODO--------text---------------------------------
app.locals.textString = (text,length)=>{
  return text.substring(0,length)
}

//TODO--------number-------------------
app.locals.formatNumber = (number)=>{
  return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

//TODO---------quantity--cart-----------------------------
app.get('*',(req,res,next)=>{
 let cart = req.session.cart
 let cart_num = 0

 for(i in cart){
    cart_num+= cart[i].quantity
  }
    res.locals.cart_num = cart_num
    console.log("สินค้า app.js : "+cart_num)
      next()
  
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/customers', customersRouter);
app.use('/admins', adminsRouter);


module.exports = app;
