var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
var crypto = require("crypto");
var secret = require("../config/secret");
var jwt = require("jsonwebtoken");
var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    country: { type: String, default: null },
    token: { type: String, default: null },
    forgot_password_token: { type: String, default: null },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null},
    salt: { type: String},
    email: { type: String, unique: [true, "This Email already exist!"], default: null},
    password: { type: String, default: null},
    phone: { type: String, default: null },
    emailVerified: { type: Boolean, default: false },
    registrationToken: { type: String, default: null },
    role: {
      type: Number,
      enum: [1, 2, 3, 4], //Admin 1, Councellor 2, Parent 3, child 4 
      default: 2
    },
    image: { type: String, default: null },
    initialStep: { type: Boolean, default: false },
    stepOneVerificationCouncellor: { type: Boolean, default: false },
    stepTwoVerificationCouncellor: { type: Boolean, default: false },
    stepThreeVerificationCouncellor: { type: Boolean, default: false },
    stepFourVerificationCouncellor: { type: Boolean, default: false },
    stepOneVerificationParent: { type: Boolean, default: false },
    stepTwoVerificationParent: { type: Boolean, default: false },
    stepThreeVerificationParent: { type: Boolean, default: false },
    isStripeConnected: { type: Boolean, default: false },
    finalStepVerified: { type: Boolean, default: false },
    address: { type: String, default: null },
    dob: { type: Date },
    totalRating: { type: Number, default: 5.00 },
    zipcode: { type: String, default: null },
    status: { type: Boolean, default: true },
    isBookedSession: { type: Boolean, default: true },
    planType: {type: String, default:'Not selected'},
    stripeChargeInfo: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
    magicLinkToken: { type: String, default: null },
    statusWithChildren: { type: String, default: null },
    beliefs: { type: String, default: null },
    uploadCalender: { type: Boolean, default: false },
    completeProfile: { type: Boolean, default: false },
    uploadVideo: { type: Boolean, default: false },
    educationInfo : [
      {
      schoolDegree: { type: String}, 
      endDate: { type: String }, 
    }],
    childInfo : [{
      nickName: { type: String, default: null }, 
      age: { type: String, default: null }, 
      parentId: { type: String, default: null }, 
      childImage: { type: String, default: null },
      status: { type: Boolean, default: true },
      bookingPoints: { type: Number, default: 0 },
      uploadingPoints: { type: Number, default: 0 },
      watchingPoints: { type: Number, default: 0 },
      likedComennt: [
        {
          commentId: { type: String, default: null },
        }
      ],
      likedVideoData: [
        {
          videoId: { type: String, default: null },
        }
      ],
      role: {
        type: Number,
        enum: [1, 2, 3, 4], //Admin 1, Councellor 2, Parent 3, child 4 
        default: 4
      },
    }],
    childLoose: { type: String, default: null },
    resideState: { type: String, default: null },
    hearAboutUs: { type: String, default: null },
    memberShipPlan: { type: String, default: null },
    fromOtherHear: { type: String, default: null },
    linkUrl: { type: String, default: null },
    resume: { type: String, default: null },
    state: { type: String, default: null },
    notAnEmployee: { type: Boolean, default: false },
    hearFromWhereAboutGuardian: { type: String, default: null },
    aboutGuardianOther: { type: String, default: null },
    licenseType: { type: String, default: null },
    certificationInfo: [
      {
      certificate: { type: String}, 
    }],
    grifCouncellingCertification: { type: Boolean, default: false },
    fullTimeUs: { type: Boolean, default: false },
    language: { type: String, default: null },
    whyGuardian: { type: String, default: null },
    aboutself: { type: String, default: null },
    cancelReason: { type: String, default: null },
    recommendation: { type: String, default: null },
    commingBackIntrest: { type: String, default: null },
    cancelStatus: { type: Boolean, default: false },
    childrenEnjoy: { type: String, default: null },
    isSessionWithCounselor: { type: String, default: null },
    improveSite: { type: String, default: null },
    subscription:{
      
    }
    
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

UserSchema.pre("save", function (next) {
  var user = this;
  // generate a random salt for every user for security
  user.salt = crypto.randomBytes(16).toString("hex");
  user.email_verification_token = crypto.randomBytes(16).toString("hex");
  user.password = crypto
    .pbkdf2Sync(user.password, this.salt, 1000, 64, "sha512")
    .toString("hex");

  next();
});

UserSchema.methods.generateJwt = function (next) {
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

UserSchema.methods.verifyToken = function (token, cb) {
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
UserSchema.statics.isEmailExist = function (email, callback) {
  var flag = false;
  UserDetail.findOne({ email: email, isDeleted: false }, function (err, user) {
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

UserSchema.statics.isDeviceTokenExist = function (deviceToken, email, callback) {
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

var UserDetail = mongoose.model("userDetail", UserSchema);
module.exports = UserDetail;
