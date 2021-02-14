let mongo = require('mongodb')
let mongoose = require('mongoose')
let url = ('mongodb://localhost:27017/Air_ShopsDB')
mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true})

//TODO-------------connect------------------------------
let db = mongoose.connection
db.on('error',console.error.bind(console,'MongoDB Connect Error'))


//TODO-------------Schema---------------
const adminSchema = mongoose.Schema({
     username:{
          type:String
     },
     password:{
          type:String
     },
     email:{
          type:String
     },
     fname:{
          type:String
     },
     lname:{
          type:String
     },

})

const Admin = module.exports = mongoose.model('admins',adminSchema)



