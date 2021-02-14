let mongo = require('mongodb')
let mongoose = require('mongoose')
let url = ('mongodb://localhost:27017/Air_ShopsDB')
mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true})

//TODO-------------connect------------------------------
let db = mongoose.connection
db.on('error',console.error.bind(console,'MongoDB Connect Error'))
//TODO-------bcrypt-------------------
let bcrypt = require('bcryptjs')

//TODO-------------Schema---------------
const userSchema = mongoose.Schema({
     username:{
          type:String
     },
     password:{
          type:String
     },
     email:{
          type:String
     },
     type:{
          type:String
     },

})

const User = module.exports = mongoose.model('users',userSchema)

//TODO------------เข้ารหัส password--------------------------------
module.exports.saveCustomer = async (newUser,newCustomer)=>{
     try {
          let salt = await bcrypt.genSalt(10)
          let hash = await bcrypt.hash(newUser.password,salt)
              newUser.password = hash
              newUser.save()
              newCustomer.save()
     } 
     catch (error) {
          console.log(error.message)
     }
}

//TODO------------เข้ารหัส password--------------------------------
module.exports.saveAdmin = async(newUser,newAdmin)=>{
    try {
          let salt = await bcrypt.genSalt(10)
          let hash = await bcrypt.hash(newUser.password,salt)
               newUser.password = hash
               newUser.save()
               newAdmin.save()
    } 
    catch (error) {
          console.log(error.message)
    }
 }

//TODO-----------เทียบ ID---------------------------------
module.exports.getUserById = (id,callback)=>{
     User.findById(id,callback)

}


//TODO------------เทียบ  username--------------------------------
module.exports.getUserByName = (username,callback)=>{
     const query = {username:username}
     User.findOne(query,callback)
 }

//TODO------------เทียบ  password--------------------------------
module.exports.comparePassword = (password,hash,callback)=>{
      bcrypt.compare(password,hash,(err,isMatch)=>{
           callback(null,isMatch)
      })
 }