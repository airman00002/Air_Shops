let mongo = require('mongodb')
let mongoose = require('mongoose')
let url = ('mongodb+srv://admin:123456abcd@react-mern-node.z6bkl.mongodb.net/Air_ShopsDB?retryWrites=true&w=majority')
mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true})


//TODO-------------connect------------------------------
let db = mongoose.connection
db.on('error',console.error.bind(console,'MongoDB Connect Error'))

//TODO-------------Schema---------------
const categorySchema = mongoose.Schema({
     id:{
          type:mongoose.Schema.ObjectId
     },
     name:{
          type:String
     },
})

const Categories = module.exports = mongoose.model('categories',categorySchema)

module.exports.getCategories = async()=>{
    try {
          return await Categories.find()
    } catch (error) {
          console.log(error.message)
    }
}

module.exports.categoriesById = async(id)=>{
   try {
          return await Categories.findById(id)
   } catch (error) {
          console.log(error.message)
   }
}
//*----------สร้าง Category ใหม่
module.exports.create_Category = async (name)=>{
    try {
          await name.save(callback)
    } catch (error) {
          console.log(error.message) 
    }
}    

//*------------Update Category----------------------------------
module.exports.update_Category = async (new_Category)=>{
     var query = {_id:new_Category.id}

    try {
          await Categories.findByIdAndUpdate(query,{
          $set:{
               name:new_Category.name
               }},
          {new:true})
    } catch (error) {
          console.log(error.message) 
    }
}

//*------------Delete Category----------------------------------
module.exports.delete_Category = async (id)=>{
     try {
          await Categories.findByIdAndDelete(id)
     } catch (error) {
          console.log(error.message) 
     }
}