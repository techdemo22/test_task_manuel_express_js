var express = require("express");
var app = express();
var router = express.Router();

var userCtrl = require("../controllers/userController");
var auth = require("../auth/auth");

router.use("/login", userCtrl.loginUser);
router.use("/loginOther", userCtrl.loginUserOther);

router.use("/createAccount", userCtrl.createAccount);
router.use("/stepVerification", auth.isAuth, userCtrl.stepVerification);
router.use("/getUserData", auth.isAuth, userCtrl.getUserData);
router.use("/payment", auth.isAuth, userCtrl.payment);
router.use("/forgotPassword", userCtrl.forgotPassword);
router.use("/accountVerification", userCtrl.accountVerification);
router.use("/resetPassword", userCtrl.resetPassword);
router.use("/getGaurdianData", userCtrl.getGaurdianData);
router.use("/editProfile", auth.isAuth, userCtrl.editProfile);
router.use("/uploadImage", auth.isAuth, userCtrl.uploadImage);
router.use("/getParentData", auth.isAuth, userCtrl.getParentData);
router.use("/getAllCounselorData", auth.isAuth, userCtrl.getAllCounselorData);
router.use("/updatePassword", auth.isAuth, userCtrl.updatePassword);
router.use("/cancelAccount", auth.isAuth, userCtrl.cancelAccount);
router.use("/deleteChildData", auth.isAuth, userCtrl.deleteChildData);
router.use("/deleteStudentData", auth.isAuth, userCtrl.deleteStudentData);
router.use("/deleteSchoolData", auth.isAuth, userCtrl.deleteSchoolData);

router.use("/updateChildInfo", auth.isAuth, userCtrl.updateChildInfo);
router.use("/updateStudentInfo", auth.isAuth, userCtrl.updateStudentInfo);
router.use("/updateSchoolInfo", auth.isAuth, userCtrl.updateSchoolInfo);

router.use("/addChild", auth.isAuth, userCtrl.addChild);
router.use("/addStudent", auth.isAuth, userCtrl.addStudent);
router.use("/addStudentAdmin", auth.isAuth, userCtrl.addStudentAdmin);


router.use("/addSchool", auth.isAuth, userCtrl.addSchool);
router.use("/addAdmin", auth.isAuth, userCtrl.addAdmin);

router.use("/logout", userCtrl.logout);
router.use("/getAllPayoutRequest", auth.isAuth, userCtrl.getAllPayoutRequest);

router.use("/getSchoolData", auth.isAuth, userCtrl.getSchoolData);
router.use("/getDistrictSchools", auth.isAuth, childrenCtrl.getDistrictSchools);
router.use("/resetPasswordStudent", userCtrl.resetPasswordStudent);

router.use("/updateDistrictAdminInfo", userCtrl.updateDistrictAdminInfo);

router.use("/deleteAdminDistrictData", userCtrl.deleteAdminDistrictData);
router.use("/deleteAdminSchoolData", userCtrl.deleteAdminSchoolData);
router.use("/getSchoolAdminStudent", userCtrl.getSchoolAdminStudent);
router.use("/updateStudentInfoAdmin", userCtrl.updateStudentInfoAdmin)

router.use("/getSchoolDataSelected", userCtrl.getSchoolDataSelected)
router.use("/createParentAccount", userCtrl.createParentAccount)

router.use("/studentForSelectedSchool", userCtrl.studentForSelectedSchool)
router.use("/videolog", auth.isAuth, userCtrl.generateVideoLog);
router.use("/update-time-stamp", auth.isAuth, userCtrl.updateTimeStamp);
router.use("/end-videolog", auth.isAuth, userCtrl.endVideoLog);

router.use("/getConsentInfo", userCtrl.getConsentInfo);

router.use('/updateWelcomeStatus', auth.isAuth, userCtrl.updateWelcomeStatus)
router.use('/verifyForgetToken', userCtrl.verifyForgetToken)

router.use('/getSchoolPlans', userCtrl.getSchoolPlans)

router.use('/checkSchoolPromoCode', userCtrl.checkSchoolPromoCode);


module.exports = router;
