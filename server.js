var express = require("express");
var path = require("path");
var favicon = require("static-favicon");
var logger = require("morgan");
var ffmpeg = require('ffmpeg');
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var cors = require("cors");
var http = require("http");
var https = require("https");
var socketio = require("socket.io");
let dotenv = require('dotenv').config()
let fs = require("fs")
 
var port = process.env.PORT || 3589;
 
// var port = process.env.PORT || 3542;
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false, limit: "100mb" }));
app.use(cors());

// var server = http.createServer(app);
// var io = socketio(server)
const chatcontroller = require("./controllers/chatController");
var admin = require("./routes/admin");
var user = require("./routes/user");
var counselor = require("./routes/counselor")
var booking = require("./routes/booking");
var paymentInfo = require("./routes/paymentInfo");
var subscription = require("./routes/subscription")
var children = require("./routes/children");
var videosession = require("./routes/videosession");
var chat = require('./routes/chat');
var card =  require("./routes/card");
var db = require("./config/db.js");
var cronJobs = require("./cronjobs/cronjob")
var parentCronJobs = require("./cronjobs/parentCronJobs")
var payout= require('./routes/payout')
var consent= require('./routes/consent')

  
cronJobs.sendAfterFivedays();
cronJobs.sendAfterAday();
cronJobs.sendAfterHalfHour();
cronJobs.everday();

parentCronJobs.afterOneDayParent();

app.use(express.static(path.join(__dirname, "public")));

//routes
app.use("/admin", admin);
app.use("/user", user);
app.use("/counselor", counselor);
app.use("/booking", booking);
app.use("/paymentInfo", paymentInfo);
app.use("/subscription",subscription);
app.use("/chat", chat);
app.use("/children", children);
app.use("/card", card);
app.use("/videosession", videosession)
app.use("/payout",payout)
app.use("/consent",consent)

  

app.use(express.static(path.join(__dirname, '..','gaurdian-lane','build')));
//app.use(express.static(path.join(__dirname, 'maintenance')));
app.get("/*", function (req, res) {
  res.sendFile(path.join(path.join(__dirname, '..','gaurdian-lane','build','index.html')));
  //res.sendFile(path.join(path.join(__dirname, 'maintenance','maintenance.html')));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

const httpsOptions = {
  // key: fs.readFileSync('/home/gitlab-runner/SSL_Free_24Jan2019/meanstack_stagingsdei_com.key', 'utf8'),
  // cert: fs.readFileSync('/home/gitlab-runner/SSL_Free_24Jan2019/meanstack_stagingsdei_com.crt', 'utf8'),
  // ca: fs.readFileSync('/home/gitlab-runner/SSL_Free_24Jan2019/meanstack_stagingsdei_com.crt'),
 

  //key: fs.readFileSync('/bigdata_gaurdianLane/server/certs/selfsigned.key', 'utf8'),
   //cert: fs.readFileSync('/bigdata_gaurdianLane/server/certs/selfsigned.crt', 'utf8')
}

var server = http.createServer(app);
//let server = https.Server(httpsOptions, app);

// var server = http.createServer(app);
io = socketio(server);

io.on('connection', (socket) => {
    
    let req = {
      socketReequest: {
        // userToken: socket.handshake.query.token,
        // userType: socket.handshake.query.userType,
        socketId: socket.id
      }
    };
      socket.on("SEND_MESSAGE", userData => { //find sender token and receiver id          
        chatcontroller.sendMessage(req, userData, (err, chatData, senderSocketId, receiverSocketId) => {
          if (err) {//there is some error while fetching records from chat collection
            console.log("Save_n_getBack_1_o_1_chatData>>>>>err", err);    
          } else {// data found now send it to sender and receiver
            io.emit('RECEIVE_MESSAGE', chatData);
          }
        });
      });

      socket.on("ALL_LIST", userData => { //find sender token and receiver id        
        chatcontroller.fetchmessagelist(req, userData, (err, chatData, senderSocketId, receiverSocketId) => {
          if (err) {//there is some error while fetching records from chat collection
            console.log("Save_n_getBack_1_o_1_chatData>>>>>err", err);    
          } else {// data found now send it to sender and receiver
            io.emit('RECEIVE_SIDEBAR_LIST', chatData);
            console.log(chatData,"chat")
            
          }
        });
      });      

      socket.on("GET_MESSAGE", userData => { //find sender token and receiver id        
        chatcontroller.getMessageOnTheBasisOfReciverId(req, userData, (err, chatData) => {
          if (err) {//there is some error while fetching records from chat collection
            console.log("Save_n_getBack_1_o_1_chatData>>>>>err", err);    
          } else {// data found now send it to sender and receiver
            io.emit('RECEIVE_MESSAGE', chatData);
          }
        });
      });

      socket.on("DELETE_MESSAGE", userData => { //find sender token and receiver id        
        chatcontroller.deleteMessage(req, userData, (err, chatData) => {
                   if (err) {//there is some error while fetching records from chat collection
            console.log("Save_n_getBack_1_o_1_chatData>>>>>err", err);    
          } else {// data found now send it to sender and receiver
            io.emit('RECEIVE_MESSAGE', chatData);
          }
        });
      });
});
/**
 * Listen on provided port, on all network interfaces.
 */    

server.listen(port, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Server api runing on port ", port);
  }
});
module.exports = app;
// app.listen(3542);
// app.listen(4000);
