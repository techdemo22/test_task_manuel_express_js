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
    //accountholderName: {type: String, default:null },
    schoolName: { type: String, default: null },
    schoolDistrictName: { type: String, default: null },
    mainContactName: { type: String, default: null },
    mainContactPhone: { type: String, default: null },
    mainContactSchoolNumber: { type: String, default: null },
    contactEmail: { type: String, default: null },
    city: { type: String, default: null },
    lastName: { type: String, default: null },
    salt: { type: String },
    email: { 
      type: String, 
      unique: [true, "This Email already exist!"], 
      required: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
      validate : {
        validator : function(email){
          return validateEmail(email);
        },
        message: "Please enter valid email address!"
      }
    },
    password: { type: String, default: null, minlength:8, maxlength:50 },
    phone: { type: String, default: null },
    emailVerified: { type: Boolean, default: false },
    registrationToken: { type: String, default: null },
    role: {
      required: true,
      type: Number,
      //enum: [1, 2, 3, 4, 5, 6, 7], //Admin 1, Councellor 2, Parent 3, child 4 
      default: 2,
      validate : {
        validator : function(arr){
            var roles = [1, 2, 3, 4, 5, 6, 7, 8];
            //1 admin
            //2 counselor
            //3 parent
            //4 child
            //5 individual school
            //6 district school
            //7 student 
            //8 staff
            return roles.includes(arr);
        },
        message   : '{VALUE} is undefined role'
      }
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
    stepFourVerificationParent: { type: Boolean, default: false },

    stepOneVerificationSchoolIndividual: { type: Boolean, default: false },
    stepTwoVerificationSchoolIndividual: { type: Boolean, default: false },

    stepOneVerificationSchoolDistrict: { type: Boolean, default: false },
    stepTwoVerificationSchoolDistrict: { type: Boolean, default: false },

    isStripeConnected: { type: Boolean, default: false },
    finalStepVerified: { type: Boolean, default: false },
    address: { type: String, default: null },
    dob: { type: Date },
    totalRating: { type: Number, default: 5.00 },
    zipcode: { type: String, default: null },
    status: { type: Boolean, default: true },
    isBookedSession: { type: Boolean, default: true },

    planType: { type: String, default: 'Not selected' },

    schoolDistrictId: { type: String, default: null },
    schoolId: { type: String, default: null },

    usedBooking: { type: Number, default: 0 },

    remaningBooking: { type: Number, default: 0 },

    remaningBookingSchool: { type: Number, default: 0 },
    remaningBookingDistrict: { type: Number, default: 0 },


    isSchoolAdmin: { type: Boolean, default: false },
    isSchoolDistrictAdmin: { type: Boolean, default: false },
    districtAdminId: { type: String, default: '' },
    schoolAdminId: { type: String, default: '' },

    stripeChargeInfo: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
    magicLinkToken: { type: String, default: null },
    statusWithChildren: { type: String, default: null },
    beliefs: { type: String, default: null },
    uploadCalender: { type: Boolean, default: false },
    completeProfile: { type: Boolean, default: false },
    uploadVideo: { type: Boolean, default: false },
    districtEmail: { type: String, default: null },
    participatingSchool: { type: String, default: null },
    accessMethod: { type: String, default: null },
    districtConnected: { type: Boolean, default: false },
    schoolConnected: { type: Boolean, default: false },

    educationInfo: [
      {
        schoolDegree: { type: String, default: false  },
        endDate: { type: String, default: false },
      }],
    childInfo: [{
      nickName: { type: String, default: null },
      age: { type: String, default: null },
      parentId: { type: String, default: null },
      childImage: { type: String, default: null },
      canUploadVideo: { type: Boolean, default: true },
      status: { type: Boolean, default: true },
      bookingPoints: { type: Number, default: 0 },
      uploadingPoints: { type: Number, default: 0 },
      watchingPoints: { type: Number, default: 0 },
      watchdedTotalVideos: {type: Number, default: 0},
      uploadTotalVideos: {type: Number, default: 0},
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
        enum: [1, 2, 3, 4, 5, 6, 7, 8], //Admin 1, Councellor 2, Parent 3, child 4 , IndividualSchool 5, District 6, 7 STUDENT, 8 School Admin/Staff
        default: 4
      },

      lastLoginDate: {
        type: Date,
        default: Date.now
      }

    }],


    // student info

    studentInfo: [{
      forgot_password_token: { type: String, default: null },
      studentSchoolId: { type: String, default: null },
      studentName: { type: String, default: null },
      studentLastName: { type: String, default: null },
      guardianName: { type: String, default: null },
      guardianEmail: { type: String, default: null },
      studentPassword: { type: String, default: null },
      studentAge: { type: String, default: null },
      schoolId: { type: String, default: null },
      studentImage: { type: String, default: null },
      status: { type: Boolean, default: true },
      bookingPoints: { type: Number, default: 0 },
      
      uploadingPoints: { type: Number, default: 0 },
      watchingPoints: { type: Number, default: 0 },
      
      watchdedTotalVideos: { type: Number, default: 0 },
      uploadTotalVideos: { type: Number, default: 0 },

      consentForm: { type: String, default: null },
      tags: { type: Array, default: null },
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
        enum: [1, 2, 3, 4, 5, 6, 7, 8], //Admin 1, Councellor 2, Parent 3, child 4 , IndividualSchool 5, District 6, Student 7
        default: 7
      },


      lastLoginDate: {
        type: Date,
        default: Date.now
      }

    }],
    schoolGradeLevel: { type: String, default: null },
    //school list
    latestMsg: { type: Boolean, default: false },
    schoolInfo: [{
      token: { type: String, default: null },
      forgot_password_token: { type: String, default: null },
      firstName: { type: String, default: null },
      schoolName: { type: String, default: null },
      mainContactName: { type: String, default: null },
      mainContactPhone: { type: String, default: null },
      mainContactSchoolNumber: { type: String, default: null },
      email: { type: String, default: null },
      city: { type: String, default: null },
      lastName: { type: String, default: null },
      address: { type: String, default: null },
      districtConnected: { type: Boolean, default: false },
      state: { type: String, default: null },


      password: { type: String, default: null },

      schoolDistrictId: { type: String, default: null },
      schoolImage: { type: String, default: null },
      stepOneVerificationSchoolIndividual: { type: Boolean, default: true },
      stepTwoVerificationSchoolIndividual: { type: Boolean, default: false },

      role: {
        type: Number,
        enum: [1, 2, 3, 4, 5, 6, 7, 8], //Admin 1, Councellor 2, Parent 3, child 4 , IndividualSchool 5, District 6, Student 7, SchoolList 8
        default: 5
      },
    }],


    childLoose: { 
      type: String, 
      enum: [null, 'Parent', 'Guardian', 'Sibling', 'Grandparent', 'Friend', 'Family friend', 'Relative', 'Teacher', 'Animal'],
      default: null
    },
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
        certificate: { type: String },
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
    subscription: {

    },
    lastLoginDate: {
      type: Date,
      default: Date.now
    },
    welcomePopUp: {
      type: Boolean,
      default: false
    },
    emailAfterSignUp:{
      type: Boolean,
      default : false
    },
    jobTitle: {
      required: false,
      type: String
    },
    students:{
      type: Number,
      default: null
    },
    onBoardPlan: {
      type: Object,
      required : false
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


var validateEmail = function(email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};

var UserDetail = mongoose.model("userDetail", UserSchema);
module.exports = UserDetail;





