var express = require('express');
var bodyParser = require('body-parser');
var Event = require('./database-mongo');
var connect = require('connect');
const path = require('path');
const mongoose = require('mongoose');
const Creator = require('./database-mongo/Creator');
const CreatorSession = require('./database-mongo/CreatorSession');
const User = require('./database-mongo/User');
const UserSession = require('./database-mongo/UserSession');
var cookieParser = require('cookie-parser'); //requires npm install
var session = require('express-session'); //requires npm install
var helpDB = require("./database-mongo/helpDB");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))

//sessions
app.use(cookieParser('shhhh, very secret'));
app.use(session({
  cookie: {secure: false, maxAge: 60000},
  secret: 'shhh, it\'s a secret',
  resave: true,
  saveUninitialized: true
}));

//database connection
mongoose.connect('mongodb://issa:isa123@ds257241.mlab.com:57241/zahgan')
mongoose.Promise = global.Promise;


var db = mongoose.connection;
db.on('error', function () {
  console.log('mongoose connection error');
});

db.once('open', function () {
  console.log('mongoose connected successfully');
});

//deployment helper

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'react-client/public')));
  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'react-client/public', 'index.html'));
  });
}


// get a list for all events from the db
app.get('/create', function (req, res, next) {
  Event.find({}).then(function (events) {
    res.send(events)
  }).catch(next)
});

//add new event to the db
app.post('/create', function (req, res, next) {
  console.log('in creat post', req.body.obj)
  if (req.body.obj.email === "") {
    req.body.obj.email = "isa@nothing.com";
  }
  if (req.body.obj.url === "") {
    req.body.obj.url = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDA4Jhlt2TGWKs8hSYa4yLTv26x7UqLoVtCbcbh1KNxPjbuo8Ibw";
  }
  //if (req.body.obj.imgName === "") {
  
  
  req.body.obj.imgName = imageName;
  console.log(imageName)
  //}
  Event.create(req.body.obj).then(function (event) {
    res.send(event)
  }).catch(next)
});

//update event in the database
app.put('/create/:id', function (req, res, next) {
  Event.findByIdAndUpdate({
    _id: req.params.id
  }, req.body).then(function () {
    Event.findOne({
      _id: req.params.id
    }).then(function (event) {
      res.send(event);
    })
  });
});

//delete event in the database
app.delete('/create/:id', function (req, res, next) {
  Event.findByIdAndRemove({
    _id: req.params.id
  }).then(function (event) {
    res.send(event)
  })
});

//error handling middleware
app.use(function (err, req, res, next) {
  res.status(400).send({
    error: err.message
  })
})



//listen to port
app.listen(process.env.PORT || 4000, function () {
  console.log('listening on port 4000!');
});

// Signup User
app.post('/account/signup', (req, res, next) => {
  console.log('in /account/signup', req.body)
  const { body } = req;
  const {
    firstName,
    lastName,
    password
  } = body;
  let { email } = body;

  if (!firstName) {
    return res.send({
      success: false,
      message: 'Error: First name cannot be blank.'
    });
  }
  if (!lastName) {
    return res.send({
      success: false,
      message: 'Error: Last name cannot be blank.'
    });
  }
  if (!email) {
    return res.send({
      success: false,
      message: 'Error: Email cannot be blank.'
    });
  }
  if (!password) {
    return res.send({
      success: false,
      message: 'Error: Password cannot be blank.'
    });
  }
  email = email.toLowerCase();
  // Steps:
  // 1. Verify email doesn't exist
  // 2. Save
  console.log('before find')
  User.find({
    email: email,
  }, (err, previousUsers) => {
    if (err) {
      return res.send({
        success: false,
        message: 'Error: Server error.'
      })
    } else if (previousUsers.length > 0) {
      return res.send({
        success: false,
        message: 'Error: Account already exists.'
      });
    } else {
      console.log('before save user')
      // Save the new user
      const newUser = new User();
      newUser.email = email;
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.password = newUser.generateHash(password);
      newUser.save((err, user) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Error: server error.'
          });
        }

        // Save the new creator
        console.log('before creatorSignUp')
        const newCreator = new Creator();
        newCreator.email = email;
        newCreator.password = newCreator.generateHash(password);
        newCreator.save((err, user) => {
          if (err) {
            return res.send({
              success: false,
              message: 'Error: server error.'
            });
          }
          return res.send({
            success: true,
            message: 'Signed up'
          });
        });
      });
    }
  });
});

// Signup Creator
app.post('/creator/signup', (req, res, next) => {
  // console.log(req.body);
  const { body } = req;
  const { password } = body;
  let { email } = body;

  if (!email) {
    return res.send({
      success: false,
      message: 'Error: Email cannot be blank.'
    });
  }
  if (!password) {
    return res.send({
      success: false,
      message: 'Error: Password cannot be blank.'
    });
  }

  console.log('in creator/signup')

  email = email.toLowerCase();

  // Save the new creator
  const newCreator = new Creator();

  newCreator.email = email;
  newCreator.password = newCreator.generateHash(password);
  newCreator.save((err, user) => {
    if (err) {
      return res.send({
        success: false,
        message: 'Error: server error.'
      });
    }
    return res.send({
      success: true,
      message: 'Signed up'
    });
  });
});

// Signin User
app.post('/account/signin', (req, res, next) => {
  console.log(req.session)
  const { body } = req;
  const { password } = body;
  let { email } = body;

  if (!email) {
    return res.send({
      success: false,
      message: 'Error: Email cannot be blank.'
    });
  }
  if (!password) {
    return res.send({
      success: false,
      message: 'Error: Password cannot be blank.'
    });
  }

  email = email.toLowerCase();

  User.find({
    email: email
  }, (err, users) => {
    if (err) {
      return res.send({
        success: false,
        message: 'Error: server error.'
      });
    }
    if (users.length != 1) {
      return res.send({
        success: false,
        message: 'Error: invalid.'
      });
    }

    const user = users[0];
    if (!user.validPassword(password)) { //Users database
      return res.send({
        success: false,
        message: 'Error: Invalid Password.'
      });
    }
    // Generate random JSON Webtoken to be saved in local storage
    var token = user.generateJwt(); //User database
    // Otherwise correct user
    const userSession = new UserSession(); //UserSession database
    userSession.userId = token;
    userSession.save((err, doc) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: server error.'
        });
      }
      return res.send({
        success: true,
        message: 'Valid User sign in',
        token: token
      });
    })
  });
});

// Signin Creator
app.post('/creator/signin', (req, res, next) => {
  const { body } = req;
  const { password } = body;
  let { email } = body;

  if (!email) {
    return res.send({
      success: false,
      message: 'Error: Email cannot be blank.'
    });
  }
  if (!password) {
    return res.send({
      success: false,
      message: 'Error: Password cannot be blank.'
    });
  }

  email = email.toLowerCase();

  Creator.find({
    email: email
  }, (err, creators) => {
    if (err) {
      return res.send({
        success: false,
        message: 'Error: server error.'
      });
    }
    if (creators.length != 1) {
      return res.send({
        success: false,
        message: 'Error: invalid.'
      });
    }

    const creator = creators[0];
    if (!creator.validPassword(password)) {
      return res.send({
        success: false,
        message: 'Error: Invalid Password.'
      });
    }
    console.log("email in signin===      1")
    createSession(req, res, creator)

    // Otherwise correct creator
    const creatorSession = new CreatorSession();
    creatorSession.userId = creator._id;
    creatorSession.save((err, doc) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: server error.'
        });
      }
      console.log("email in signin===" , email)
      return res.send({
        success: true,
        message: 'Valid Manager sign in',
        token: doc._id,
        sess: req.session.creatorID,
        email: email
      });
    })
  });
});

// is Creator Loggedin ?
app.get('/creator/signin/check', (req, res, next) => {
  return res.send({
    success: true,
    message: 'Check!',
    sess: req.session.creatorID,
    email: req.session.creatorEmail
  })
});

// Creator Logout
app.get('/creator/logout', (req, res, next) => {
  console.log("before", req.session)
  req.session.destroy(function() { //remove session
    res.status(200).send()
  });
  console.log("after", req.session)
});

// User Logout
app.post('/account/logout', (req, res, next) => {
  // Get the token
  const { body } = req;
  const { headers } = req;
  const { token } = headers;
  // Verify the token is one of a kind and is not deleted

  UserSession.findOneAndUpdate({
    userId: token,
    isDeleted: false
  }, {
      $set: {
        isDeleted: true
      }
    }, null, (err, sessions) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: server error',
          err: err
        });
      }
      return res.send({
        success: true,
        message: 'Good bye! Please come again!'
      })
    })
});

var createSession = function (req, res, newCreator) {
  console.log("before regenerate", 'req.session', req.session)
  var clients = []
  req.session.regenerate(function (err) {
    if (err) { return err }
    req.session.creatorID = String(newCreator._id); //most important section of this function
    req.session.creatorEmail = String(newCreator.email);
    console.log('email in session', req.session.creatorEmail)
    req.session.cookie.expires = new Date(Date.now() + 3600000) //a date for expiration
    req.session.cookie.maxAge = 3600000; //a specific time to destroys
    req.session.save(function(err) {
      //header is json
      console.log('after save session', req.session)
    })
  });
};

//Get firstName of User
app.get('/getSpecificUser', function (req, res, next) {
  var firstName = req.query.name;
  User.getSpecificCurrency(name, (err, result) => {
    let response = result.map(val => {
      return {
        firstName: val.firstName
      };
    });
    res.send(response);
  });
});

//get user's events
app.post('/creator/events', function (req, res, next) {
  var email = req.body.email;
  console.log('email', email)
  Event.find({email: email}, (err, result) => {
    res.send({
      success: true,
      message: '!',
      events: result,
    });
  });
});

// Verify Creator
app.get('/account/verify', (req, res, next) => {
  // Get the token
  const { query } = req;
  const { token } = query;
  // ?token = test

  // Verify the token is one of a kind and is not deleted

  CreatorSession.find({
    _id: token,
    isDeleted: false
  }, (err, sessions) => {
    if (err) {
      return res.send({
        success: false,
        message: 'Error: server error'
      });
    }

    if (sessions.length != 1) {
      return res.send({
        success: false,
        message: 'Error: Invalid'
      });
    } else {
      return res.send({
        success: true,
        message: 'Good'
      })
    }
  })
});

// Creator Logout
app.get('/account/logout', (req, res, next) => {
  // Get the token
  const { query } = req;
  const { token } = query;
  // ?token = test

  // Verify the token is one of a kind and is not deleted

  CreatorSession.findOneAndUpdate({
    _id: token,
    isDeleted: false
  }, {
      $set: {
        isDeleted: true
      }
    }, null, (err, sessions) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: server error'
        });
      }

      return res.send({
        success: true,
        message: 'Good'
      })

    })
});


const multer = require('multer');
const ejs = require('ejs');

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './react-client/public/images/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

// EJS
app.set('view engine', 'ejs');


var imageName;
app.post('/upload', (req, res) => {
  console.log('in upload hello')
  upload(req, res, (err) => {
    if(err){
      res.render('index', {
        msg: err
      });
    } else {
      if(req.file == undefined){
        res.render('index', {
          msg: 'Error: No File Selected!'
        });
      } else {
        //imageName = req.file.filename
        imageName = 'http://' + 'localhost:3000' + '/images/' + req.file.filename;
        console.log(imageName)
        // res.send({
        //   name: `${req.file.filename}`
        // });
      }
    }
  });
});

app.get('/upload', (req, res) => {
  res.send(imageName)
})

// to save the query from the help component into the database
app.post("/help", function (req, res, next) {
  helpDB.create(req.body.queryDetails)
    .then(function (data) {
      res.send(data);
    })
    .catch(next);
});


