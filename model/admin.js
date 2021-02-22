let mongo = require('mongodb')
let mongoose = require('mongoose')
let url = ('mongodb+srv://admin:123456abcd@react-mern-node.z6bkl.mongodb.net/Air_ShopsDB?retryWrites=true&w=majority')
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



