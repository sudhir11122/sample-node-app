var http = require('http'),
    path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    cors = require('cors')

    
var isProduction = process.env.NODE_ENV === 'production';

// Create global app object
var app = express();

app.use(cors());

// Normal express config defaults
//app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));

app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));

// if (!isProduction) {
//   app.use(errorhandler());
// }

// if(isProduction){
//   mongoose.connect(process.env.MONGODB_URI);
// } else {
//   mongoose.connect('mongodb://localhost/conduit');
//   mongoose.set('debug', true);
// }

// require('./models/User');
// require('./models/Article');
// require('./models/Comment');
// require('./config/passport');

//app.use(require('./routes'));




/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(function(err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({'errors': {
      message: err.message,
      error: err
    }});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({'errors': {
    message: err.message,
    error: {}
  }});
});

// finally, let's start our server...
var server = app.listen( process.env.PORT || 3000, function(){
  console.log('Listening on port ' + server.address().port);
});


app.get('/getGroupData', (req, res) => {
  let data = `Asset1 timestamp:9:23, temp: 45, pressure:80
  Asset1 timestamp:9:15, temp: 40, pressure:60
  Asset1 timestamp:9:33, temp: 76, pressure:100
  Asset2 timestamp:9:43, temp: 90, pressure:120
  Asset2 timestamp:9:23, temp: 45, pressure:80`;


  let arr = [];
  arr = data.split("\n")
  let new_arr = [];
  arr.forEach((e) => {
    var splitkey = e.split(",");
    let obj = {};

    let first = splitkey[0].split(":");
    let firstkey = first[0].trim().replace(" ","_");
    let firstvalue = first[1]+":"+first[2];

    let second = splitkey[1].split(":");
    let secondkey = second[0].trim();
    let secondvalue = second[1];

    let third = splitkey[2].split(":");
    let thirdkey = third[0].trim();
    let thirdvalue = third[1];

    obj[firstkey]= firstvalue;
    obj[secondkey]= secondvalue;
    obj[thirdkey]= thirdvalue;
    new_arr.push(obj);
  });

  let obj1 = {};
  new_arr.forEach((value) => {
    if(!!obj1[Object.keys(value)[0]] && obj1[Object.keys(value)[0]].length>0){
      obj1[Object.keys(value)[0]].push(value);
    } else {
      obj1[Object.keys(value)[0]] = []
      obj1[Object.keys(value)[0]].push(value);
    }
  })

  let obj2 = {};
  Object.keys(obj1).forEach(function(key) {
    let sortData = obj1[key].sort((a, b) => (a[key] > b[key]) ? 1 : -1);
    obj2[key] = sortData;
  });
  res.send({status:"success",data:obj2});
});
