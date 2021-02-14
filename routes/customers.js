var express = require('express');
var router = express.Router();

//TODO------------DB---------------------
const User = require('../model/user')
const Customer = require('../model/customer')
const Product = require('../model/product')
const Categories = require('../model/categories')
const Order = require('../model/order')
const { hash } = require('bcryptjs');

const stripe = require('stripe')('sk_test_51I5CPxHXfE95nDyQ1itv6H8A6t0I0booJP1e1Iq9RGg2Af2n8Fb792SPS2dE11sEbdBF2DrTJC9dfY4JyTLwkxD100dBNaaxFG')
const moment = require('moment')


//*--------------------------------------------------------------------------------------------------
/* GET home page. */
router.get('/home',enSureLogin,async function(req, res, next) {
  let product = await Product.ShowProduct()
  let category =await Categories.getCategories()
    res.render('customers/home',{products:product,categories:category}); 
});
function enSureLogin(req,res,next){
  if(req.isAuthenticated()){
    next()
  }else{
    res.redirect('/users/login')
  }
}


//TODO------View----Show product---------------------
router.get('/product/:id',async function(req, res, next) {
  let user = req.user.type
  let product =await Product.ShowProductById(req.params.id)
    res.render('show_product',{products:product,user:user})
});

//TODO-------View---Customer Cart---------------------
router.get('/cart/',function(req, res, next) {
  let cart = req.session.cart
  let id_delete = req.query.id
  //*-------------ลบสินค้า----------------------
  for(item in cart){
    if(cart[item].id ==id_delete){
      // console.log("** ค่าตรงกัน **")
      delete cart[item]
    }
  }
  let show_cart ={item:[],total:0}
  let total=0
  let cart_num = 0
  for(i in cart){
    show_cart.item.push(cart[i])
    total += cart[i].quantity * cart[i].price
    cart_num+= cart[i].quantity
  }
  show_cart.total = total
  // console.log(show_cart)
  // console.log(cart)
  
  console.log("จำนวนสินค้า : "+cart_num)

  res.render('customers/cart',{cart:show_cart,cart_num:cart_num})
});

//TODO-------View-Order---------------------------------------------------
router.get('/view_order',async function(req, res, next) {
  let order =await Order.ShowOrder()
     res.render('customers/view_order',{orders:order,moment:moment})
    //  console.log(order)
});

//TODO-------View-Order-History---------------------------------------------
router.get('/view_order_history/:id',async function(req, res, next) {
  let orders =await Order.ShowOrderById(req.params.id)
    res.render('customers/view_order_history',{orders:orders,moment:moment})
});


//*-------------------------------------------------------------------------------------------------------------------------------------

//TODO----------Search product_Name && Category--------------------
router.get('/product/',async function(req, res, next) {
    let search_product = req.query.name
    let search_category = req.query.category

    if(search_product){
      let category =await Categories.getCategories()
      let product =await Product.getProductByName(search_product)
           res.render('customers/search_project',{categories:category,products:product,search:search_product})
    }

    if(search_category){
      let category =await Categories.getCategories()
      let product =await Product.getCategoryByProduct(search_category)
          res.render('customers/search_project',{categories:category,products:product,search:search_category})
    }

});

//TODO----------Customer Cart---session------------------
router.post('/cart',async function(req, res, next) {
  
  req.session.cart = req.session.cart || {}   //*จองพื้นที่ cart -req.session.cart ถ้ามีข้อมูลก่อนหน้าให้กำหนดลงไป 
                                              //*ถ้าไม่มีข้อมูลในตะกร้าจะจองเป็นค่าว่าง
  let id = req.body.id
  let cart = req.session.cart
  
    let product= await Product.ShowProductById(id)
      if(cart[id]){
        cart[id].quantity++
      }else{
        cart[id]={
          id:product._id,
          img:product.img,
          name:product.name,
          price:product.price,
          quantity:1
        }
      }
      res.redirect('/customers/cart')
});



//TODO------payment-------------------------------------------------------
router.post('/payment',async (req,res,next)=>{ 

  let token = req.body.stripeToken
  let amount = req.body.amount
  let email = req.body.stripeEmail

  let amount_order = (amount/100)
  let name = req.body.stripeBillingName
  let postcode = req.body.stripeBillingAddressZip
  let street = req.body.stripeBillingAddressLine1
  let city = req.body.stripeBillingAddressCity 

//*-----------สร้าง Order-----------------------------------------------

  let cart = req.session.cart
  let cart_product  = []
    for(i in cart){
    cart_product.push(cart[i])
    }
    console.log(cart_product)

  const new_Order = new Order({
    name:name,
    city:city,
    postcode:postcode,
    total:amount_order,
    email:email,
    token:token,
    date: new Date(),
    order_item:cart_product
    
  })
  await Order.create_Order(new_Order)
  
//*---------- จ่ายเงิน-------------------------------------------
  try {
    let charge =await stripe.charges.create({
    source:token,
    amount:amount,
    currency:'thb'
    })

    delete req.session.cart
    res.redirect('/customers/home')
  } 
  catch (error) {
    console.log(error.message)  
  }

})
//*------payment-----------------------------------------------------

module.exports = router;
