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
        console.log(err);
        if(err.code === 11000){
          return res.json({error : true, message: "Email id already exist."})
        }
        return res.json({error: true, message: "Something went wrong. Please try again"});
      })
})

router.post('/add-log-in-db', function (req, res) {
  let data = {
    message: req.body.message || '',
    url: req.body.url || '',
    line: req.body.line || '',
    col: req.body.col || '',
    error: req.body.error || '',
    app_id: req.app_id || uuidv1()
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
  ErrorModel.find({}).exec(function (err, data) {
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
