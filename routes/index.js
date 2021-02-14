var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/',enSureLogin,function(req, res, next) {
  res.render('index');
});
function enSureLogin(req,res,next){
  if(req.isAuthenticated()){
    next()
  }else{
    res.redirect('/users/login')
  }
}



module.exports = router;
