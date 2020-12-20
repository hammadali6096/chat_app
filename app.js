const express = require('express');
var app = express();
const path = require('path');
let port = 4000 || process.env.PORT;
const server = require('http').Server(app)
const io = require('socket.io')(server)
const pool = require('./db');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

var users = {};
io.on('connection', socket => {
  console.log("new user");
  socket.on('user', (name) => {
    console.log("user= " + name);
    users[name] = socket.id;
     console.log("users/sockets  :" + JSON.stringify(users));

  })
  socket.on('send-chat-message', (reciever, userName, message) => {
  console.log("Reciever: "+reciever);
  console.log("Sender: "+userName);
  console.log("Message: "+message);

  io.to(users[reciever]).emit('message', {
    msg: message,
    name: userName
  });

    // socket.to(room).broadcast.emit('chat-message', {
    //   message: message,
    //   name: userName,
    // })
  });

    socket.on('disconnect', () => {
      var user = getKeyByValue(users,socket.id);

        console.log( user+" disconnected");
        delete users[user]
    console.log("users  :" + JSON.stringify(users));

    })
    function getKeyByValue(object, value) {
      return Object.keys(object).find(key => object[key] === value);
    }
});

app.get('/', function (reqq, res, next) {
  res.render('login', {
    title: 'express'
  })
})
app.post('/login', function (reqq, res, next) {
  var userName = reqq.body.user;
  console.log(reqq.body.user);
  pool.query("Select * FROM users where userName='" + userName + "'", function (err, rows) {
    if (err) throw err;
    else {
      if (rows.length == 1) {
        console.log(rows.length);
        pool.query("Select * FROM users where not userName='" + userName + "'", function (err, rows) {
          if (err) throw err;
          else {
            res.render('users', {
              rows: rows,
              userName: userName
            })
          }
        });
      } else {
        console.log(rows.length);
        res.render('login', {
          title: 'express'
        })

      }
    }
  })
})

app.get('/create_room', function (req, res, next) {
  let user1 = req.query.user1;
  let user2 = req.query.user2;
  console.log("user1= ", user1);
  console.log("user2= ", user2);
  res.render('chat', {
    userName: req.query.user1,
    reciever: req.query.user2
  })
})


server.listen(port, () => {
  console.log("server is listing on port " + port);
});