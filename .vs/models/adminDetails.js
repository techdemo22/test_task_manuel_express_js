var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
var crypto = require("crypto");
var secret = require("../config/secret");
var jwt = require("jsonwebtoken");
var Schema = mongoose.Schema;

var AdminSchema = new Schema(
  {
    // country: { type: String, default: null },
    token: { type: String, default: null },
    forgot_password_token: { type: String, default: null },
    adminFname: { type: String },
    salt: { type: String},
    adminEmail: { type: String, default: null},
    adminPassword: { type: String, default: null},
    adminContact: { type: String, default: null },
    invoiceFooter: { type: String, default: null },
    companyName: { type: String, default: null },
    address: { type: String, default: null },
    image: { type: String, default: null }, //make it default logo of site
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

AdminSchema.pre("save", function (next) {
  var user = this;
  // generate a random salt for every user for security
  user.salt = crypto.randomBytes(16).toString("hex");
  user.email_verification_token = crypto.randomBytes(16).toString("hex");
  user.adminPassword = crypto
    .pbkdf2Sync(user.adminPassword, this.salt, 1000, 64, "sha512")
    .toString("hex");

  next();
});

AdminSchema.methods.generateJwt = function (next) {
  var expiry = new Date();
  return jwt.sign(
    {
      _id: this._id,
      email: this.email
      // username: this.username,
    },
    secret.secret
    // { expiresIn: "24h" }
  ); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

AdminSchema.methods.verifyToken = function (token, cb) {
  jwt.verify(token, secret.secret, function (err, dcode) {
    if (err) {
      cb(false);
    } else {
      cb(dcode);
    }
  });
};
/*
 * Function: isEmailExist
 * Des: Funtion is use to check is email exist or not in our records
 */
AdminSchema.statics.isEmailExist = function (email, callback) {
  var flag = false;
  adminData.findOne({ email: email, is_deleted: false }, function (err, user) {
    if (err) {
      res.json({ status: 0, msg: "Something went wrong" });
    } else {
      if (user) {
        flag = true;
      } else {
        flag = false;
      }
    }
    callback(flag);
  });
};

/*
 * Function: isdeviceTokenExist
 * Des: Funtion is use to check is token exist ot not in record
 */

AdminSchema.statics.isDeviceTokenExist = function (deviceToken, email, callback) {
  var flag = false;
  adminData.findOne(
    { "device_info.device_id": deviceToken, email: email },
    function (err, user) {
      if (err) {
        res.json({ status: 0, msg: "Something went wrong" });
      } else {
        if (user) {
          flag = true;
        } else {
          flag = false;
        }
      }
      callback(flag);
    }
  );
};

var AdminData = mongoose.model("adminData", AdminSchema);
module.exports = AdminData;
