let express = require('express');
let ErrorModel = require('../mongo-models/ErrorSchema');
let UserProfileModel = require('../mongo-models/UserSchema');
let router = express.Router();
let jwt =  require("jsonwebtoken");
let _ =  require("lodash");
const uuidv1 = require('uuid/v1');



const JWT_SECRET= "##!%$^67jbsfgbcbHT**()^869wGFSCA"

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/user-sign-up', function (req, res, next) {
    let data = {
      name : req.body.name,
      email : req.body.email,
      password : req.body.password
    };

    let user = new UserProfileModel(data);

    console.log('user',user);

    return user.save()
      .then(function (savedUser) {
        console.log('Saved User:', savedUser);

        let payload = {
          _id : savedUser._id,
          name: savedUser.name,
          email: savedUser.email
        };
        let token = jwt.sign(payload, JWT_SECRET, {
          expiresIn: 3600*24
        });

        let plainObject = savedUser.toObject();
        plainObject.auth_token = token;

        return res.json({error: false, data: _.omit(plainObject, ['password']), message: 'Registration Successful' });
      })
      .catch(function (err) {
        console.log('********errr while saving',err);
        if(err.code === 11000){
          return res.json({error : true, message: "Email id already exist."})
        }
        return res.json({error: true, message: "Something went wrong. Please try again"});
      })
})

router.post('/login-user', async function (req, res, next) {

  console.log('req.body:', req.body);
  let provided_mail = req.body.email;
  let provided_password = req.body.password;
  if(!provided_mail || !provided_password){
    return res.json({
      error : true,
      message: "Email/Password is required"
    });
  }

  let user_info = await UserProfileModel.findOne({email: provided_mail});
  console.log('AFTER IF', user_info);


  if(user_info === null){
    return res.json({
      error : true,
      message: "This user does not exist. Try another email"
    })
  } else {
    user_info.comparePassword(provided_password, function(err, isMatch){
      if (err) {
        console.log("matching password.......");
        return res.json({error : true, reason : err});
      }
      if(!isMatch) {
        return res.json({error : true, message: 'You have entered wrong password'})
      } else {
        let payload = {
          _id : user_info._id,
          name: user_info.name,
          email: user_info.email
        };
        let token = jwt.sign(payload, JWT_SECRET, {
          expiresIn: 3600*24
        });
        return res.json({error : false, auth_token: token, message: "Log in successful"})
      }
    })
  }
})

router.post('/add-log-in-db', function (req, res) {
  let data = {
    msg: req.body.msg || '',
    url: req.body.url || '',
    line: req.body.line || '',
    col: req.body.col || '',
    error: req.body.error || '',
    app_id: req.app_id || uuidv1(),
    createdAt: new Date(),
    userAgent: req.body.userAgent || ''
  };

  let newError = new ErrorModel(data);
  newError.save().then(function (savedError) {
    console.log('SAVED Error:', savedError);
    console.log('REQ.IO:', req.io.sockets);

    req.io.sockets.emit('dataFromServer', savedError); // everyone gets it

    return res.json({code: 'SUCCESS', savedError: savedError})
  }).catch(function (err) {
    console.log('ERROR:', err);
    return res.json({code: 'FAILURE', error: err})
  })
});

router.get('/get-all-errors', function (req, res) {
  ErrorModel.find({}).sort({ createdAt: -1 }).exec(function (err, data) {
    if (err){
      return res.json({code: 'FAILURE', error: err})
    }
    if(data){
      console.log('Erros:', data);
      return res.json({
        code : 'SUCCESS',
        errorList : data,
      });
    }
  });
});

module.exports = router;
