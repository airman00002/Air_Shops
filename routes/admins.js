var express = require('express');
var router = express.Router();

//TODO------------DB---------------------
const User = require('../model/user')
const Customer = require('../model/customer')
const Product = require('../model/product')
const Categories = require('../model/categories')

//TODO--------validator---------------
const {body,validationResult} = require('express-validator')

//TODO-----multer-------------------
const multer = require('multer')
let storage =  multer.diskStorage({
  destination:(req,file,callback)=>{
    callback(null,'./public/images')
  },
  filename:(req,file,callback)=>{
    callback(null,Date.now()+'.jpg')
  }
})

const upload = multer({storage:storage})



/* GET home page. */
router.get('/home',enSureLogin,async function(req, res, next) {
    
        let product =await Product.ShowProduct()
        let category = await Categories.getCategories()
        res.render('admins/home',{products:product,categories:category});
});

function enSureLogin(req,res,next){
  if(req.isAuthenticated()){
    next()
  }else{
    res.redirect('/users/login')
  }
}


//TODO----------Add_categories---------------------
router.get('/categories/add',async function(req, res, next) {
    let category= await Categories.getCategories()
    res.render('admins/add_category',{categories:category})
  

});

//TODO----------Add_product---------------------
router.get('/products/add',async function(req, res, next) {
  let category =await Categories.getCategories() 
    res.render('admins/add_product',{categories:category})
  
});

//TODO----------Show product---------------------
router.get('/product/:id',async function(req, res, next) {
  let product = await Product.ShowProductById(req.params.id)
    res.render('show_product',{products:product})
  
  
});

//TODO----------Categories---------------------
router.get('/categories',async function(req, res, next) {
  let category =await Categories.getCategories()
    res.render('admins/categories',{categories:category})
  
});


//TODO----------Products---------------------
router.get('/products',async function(req, res, next) {
    let product = await Product.ShowProduct()
    let category =await Categories.getCategories()
    res.render('admins/products',{products:product,categories:category});
    

});

//TODO----------Categories_edit---------------------
router.get('/categories/edit/:id',async function(req, res, next) {
  let category_id = req.params.id
  let category = await Categories.getCategories() 
  let category_one = await Categories.categoriesById(category_id)
      res.render('admins/edit_category',{categories:category,category_one:category_one})
});

//TODO----------Products_edit---------------------
router.get('/products/edit/:id',async function(req, res, next) {
  let product_id = req.params.id
  let category = await Categories.getCategories() 
  let product = await Product.ShowProductById(product_id)
    res.render('admins/edit_product',{categories:category,products:product})
});

//TODO----------Categories_delete---------------------
router.get('/categories/delete/:id',async function(req, res, next) {
  let category_id = req.params.id
  await Categories.delete_Category(category_id)
    res.redirect('/admins/categories')
});

//TODO----------Products_delete---------------------
router.get('/products/delete/:id',async function(req, res, next) {
  let products_id = req.params.id
  await Product.delete_Product(products_id)
    res.redirect('/admins/home')
});

//TODO----------Management---------------------
router.get('/clients',async function(req, res, next) {
  let category = await Categories.getCategories()
  let customer = await Customer.Show_customer()
    res.render('admins/clients',{categories:category,customers:customer})  
});

//*-------------------------------------------------------------------------------------------------

//TODO----------Search product_Name && Category--------------------
router.get('/product/',async function(req, res, next) {
    let search_product = req.query.name
    let search_category = req.query.category

    if(search_product){
      let category = await Categories.getCategories()
      let product =await Product.getProductByName(search_product)
        res.render('admins/search_project',{categories:category,products:product,search:search_product})
        console.log(product.length)
    }

    if(search_category){
      let category =await Categories.getCategories()
      let product = await Product.getCategoryByProduct(search_category)
          res.render('admins/search_project',{categories:category,products:product,search:search_category})
          console.log(search_category)
    }
});
//*----------Search product_Name && Category--------------------

//TODO----------Add_categories-----------------------------------------------
router.post('/categories/add',body('name','กรูณาระบุหมวดหมู่').not().isEmpty(),
            async function(req, res, next) {
    const result = validationResult(req)
    const errors = result.errors
    if(!result.isEmpty()){
      let usertype = req.user.type
      res.render('admins/add_category',{errors:errors,user:usertype})
    }else{
      
      const new_Category = new Categories({
        name:req.body.name
      })
      await Categories.create_Category(new_Category)
        res.redirect('/admins/home')
    }
});
//*----------Add_categories-----------------------------------------------

//TODO----------Add_products-----------------------------------------------
router.post('/products/add',body('img','กรูณาระบุ URL').not().isEmpty(),
                            body('name','กรูณาระบุชื่อสินค้า').not().isEmpty(),
                            body('description','กรูณาระบุรายละเอียด').not().isEmpty(),
                            body('price','กรูณาระบุราคา').not().isEmpty(),

                            async function(req, res, next) {

    const result = validationResult(req)
    const errors  =result.errors
    if(!result.isEmpty()){
      let usertype = req.user.type
      let category = await Categories.getCategories()
        res.render('admins/add_product',{errors:errors,categories:category,user:usertype})
    }else{
      

        const new_Product = new Product({
          name:req.body.name,
          description:req.body.description,
          price:req.body.price,
          category:req.body.category,
          img:req.body.img
        })
        console.log(new_Product)
        await Product.create_Product(new_Product) 
          res.redirect('/admins/home')
          // res.status(201).end("Success created")
    }
});
//*-----------Add_products-----------------------------------------------


//TODO--------post--Categories_edit-----------------------------------------------
router.post('/categories/edit',body('name','กรูณาระบุหมวดหมู่').not().isEmpty(),
            async function(req, res, next) {
    const result = validationResult(req)
    const errors = result.errors
    if(!result.isEmpty()){
      let category = await Categories.getCategories()
        res.render('admins/edit_category',{errors:errors,categories:category})
    }else{
      let id = req.body.id
      let name = req.body.name

      const new_Category = new Categories({
        id:id,
        name:name
      })
      await Categories.update_Category(new_Category)
        res.redirect('/admins/categories')
      // console.log(new_Category)
    }
});

//TODO--------post--Products_edit-----------------------------------------------
router.post('/products/edit', body('img','กรูณาระบุ URL').not().isEmpty(),
                              body('name','กรูณาระบุชื่อสินค้า').not().isEmpty(),
                              body('description','กรูณาระบุรายละเอียด').not().isEmpty(),
                              body('price','กรูณาระบุราคา').not().isEmpty(),
                              
                              async function(req, res, next) {
    const result = validationResult(req)
    const errors = result.errors
    if(!result.isEmpty()){
      let category =await Categories.getCategories()
        res.render('admins/add_product',{errors:errors,categories:category})
    }else{

      if(req.body.img){
        var img_file = req.file.filename

        const new_Product = new Product({
          id:req.body.id,
          name:req.body.name,
          description:req.body.description,
          price:req.body.price,
          category:req.body.category,
          img:req.body.img
        })
        await Product.update_Product(new_Product)
        res.redirect('/admins/home')

      }else{

        const new_Product = new Product({
          id:req.body.id,
          name:req.body.name,
          description:req.body.description,
          price:req.body.price,
          category:req.body.category,
        })
      await Product.update_Product_No_image(new_Product)
        res.redirect('/admins/home')
      } 
      // console.log(new_Product)
    }
});
module.exports = router;
