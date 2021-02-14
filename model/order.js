let mongo = require('mongodb')
let mongoose = require('mongoose')
let url = ('mongodb://localhost:27017/Air_ShopsDB')
mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true})

//TODO-------------connect------------------------------
let db = mongoose.connection
db.on('error',console.error.bind(console,'MongoDB Connect Error'))


//TODO-------------Schema---------------
const orderSchema = mongoose.Schema({
     id:{
          type:mongoose.Schema.ObjectId
     },
     name:{
          type:String
     },
     city:{
          type:String
     },
     postcode:{
          type:String
     },
     total:{
          type:Number,min:1
     },
     email:{
          type:String
     },
     token:{
          type:String
     },
     date:{
          type:Date
     },
     order_item:Array
          
    
})

const Order = module.exports = mongoose.model('orders',orderSchema)

//*--------------show data----------------
module.exports.ShowOrder =async()=>{
     try {
          return await Order.find()
     } catch (error) {
          console.log(error.message)  
     }
} 
// //*--------------show data By Id----------------
module.exports.ShowOrderById =  async(id)=>{
     try {
          return await Order.findById(id)
     } catch (error) {
          console.log(error.message)  
     }
}

// //*--------------show data By name----------------
// module.exports.getProductByName = (name,callback)=>{
//      var query = {name:name}
//      Product.find(query,callback)
// }

// //*--------------บันทีกข้อมูล----------------
module.exports.create_Order = async(new_Order)=>{
    try {
          await new_Order.save()
    } catch (error) {
          console.log(error.message)  
    }
}


// [
//      {
//      name:String,
//      img:String,
//      price:{
//       type:Number,min:1
//            },
//      quantity:{
//       type:Number,min:1
//            }
//       }
//  ]