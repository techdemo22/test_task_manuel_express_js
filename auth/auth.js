var mongoose = require("mongoose");
var AdminData = require("../models/adminDetails");
var UserDetail = require("../models/userDetails");

exports.isAuth = function(req, res, next) {
  if (!req.headers.authorization || req.headers.authorization === "undefined") {
    return res.json({
      status: 401,
      msg: "Session Expired, Please login again"
    });
  }
  var token = req.headers.authorization;
  var user = new UserDetail();
  user.verifyToken(token, function(valid) {
    if (!valid) {
      return res.json({
        status: 401,
        msg: "Session Expired, Please login again"
      });
    } else {
      UserDetail.findOne({ _id: valid._id, isDeleted: false }, function(
        err,
        getUser
      ) {
        if (getUser) {
          req.body.user_params = valid;
          req.decoded = getUser
          next();
        } else {
          return res.json({
            status: 403,
            msg: "Session Expired, Please login again"
          });
        }
      });
    }
  });
};

exports.isAdminAuth = function(req, res, next) {
  if (!req.headers.authorization || req.headers.authorization === "undefined") {
    return res.json({
      status: 401,
      msg: "Session Expired, Please login again"
    });
  }
  var token = req.headers.authorization;
  var adminData = new AdminData();
  adminData.verifyToken(token, function(valid) {
    if (!valid) {
      return res.json({
        status: 401,
        msg: "Unauthorized access,please login again as admin"
      });
    } else {
      AdminData.findOne({ _id: valid._id, isDeleted: false, }, function(
        err,
        getUser
      ) {
        if (getUser !== null) {
          req.body.user_params = valid;
          next();
        } else {
          return res.json({
            status: 401,
            msg: "Session Expired, Please login again"
          });
        }
      });
    }
  });
};