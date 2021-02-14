let mongo = require('mongodb')
let mongoose = require('mongoose')
let url = ('mongodb://localhost:27017/Air_ShopsDB')
mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true})

//TODO-------------connect------------------------------
let db = mongoose.connection
db.on('error',console.error.bind(console,'MongoDB Connect Error'))


//TODO-------------Schema---------------
const productSchema = mongoose.Schema({
     id:{
          type:mongoose.Schema.ObjectId
     },
     name:{
          type:String
     },
     description:{
          type:String
     },
     price:{
          type:Number,min:1
     },
     category:{
          type:String
     },
     img:{
          type:String
     }

})

const Product = module.exports = mongoose.model('products',productSchema)

//*--------------show data----------------
module.exports.ShowProduct = async()=>{
   try {
     return await Product.find()
   } 
   catch (error) {
     console.log(error.message)
   }
} 
//*--------------show data By Id----------------
module.exports.ShowProductById = async(id)=>{
   try {
     return await Product.findById(id)
   } 
   catch (error) {
     console.log(error.message)
   }
}

//*--------------show data By name----------------
module.exports.getProductByName = async(name)=>{
     var query = {name:name}
     try {
          return await Product.find(query)
     } catch (error) {
          console.log(error.message)
     }
}

module.exports.getCategoryByProduct = async(category)=>{
     var query = {category:category}
     try {
          return await Product.find(query)
     } catch (error) {
          console.log(error.message)
     }
}
//*-------------สร้าง Product--------------------------------
module.exports.create_Product = async(new_product)=>{
    try {
          await new_product.save()
    } catch (error) {
          console.log(error.message)
    }
}

//*----------------Update_Product-------------------------------
module.exports.update_Product = async(new_Product)=>{
     var query = {_id:new_Product.id}
    try {
     await Product.findByIdAndUpdate(query,{
          $set:{
               name:new_Product.name,
               description:new_Product.description,
               price:new_Product.price,
               category:new_Product.category,
               img:new_Product.img  
               }},
          {new:true})
    } catch (error) {
          console.log(error.message)
    }
}

//*----------------Update_Product No-image-------------------------------
module.exports.update_Product_No_image = async(new_Product)=>{
     var query = {_id:new_Product.id}
    try {
     await Product.findByIdAndUpdate(query,{
          $set:{
               name:new_Product.name,
               description:new_Product.description,
               price:new_Product.price,
               category:new_Product.category,
               }},
          {new:true})
    } catch (error) {
          console.log(error.message)
    }
}



//*------------Delete_Product----------------------------------
module.exports.delete_Product = async(id)=>{
   try {
          await Product.findByIdAndDelete(id)
   } catch (error) {
          console.log(error.message)
   }
}