let express = require('express');
let ErrorModel = require('../mongo-models/ErrorSchema');
let router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/add-log-in-db', function (req, res) {
  let data = {
    message: req.body.message || '',
    url: req.body.url || '',
    line: req.body.line || '',
    col: req.body.col || '',
    error: req.body.error || ''
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
