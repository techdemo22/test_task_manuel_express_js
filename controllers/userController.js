"use strict";
var UserDetail = require("../models/userDetails");
var constant = require("../config/constants");
var crypto = require("crypto");
var formidable = require('formidable');
var validator = require("email-validator");
var mongoose = require("mongoose");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

var mailer = require("../mailer/mailer")
const fs = require('fs');
var jwt = require('jsonwebtoken');
const mySecret = process.env.JWT_SECRET
const awsUploader = require("./awsUploader");
const { Console } = require("console");
const { mainModule } = require("process");
const { Kafka } = require("aws-sdk");
const constants = require("../config/constants");

var createAccount = function (req, res) {
    
  let registrationToken = crypto.randomBytes(25).toString("hex");
  var token = crypto.randomBytes(25).toString("hex");
  var defaultLang = req.headers.currentlang ? req.headers.currentlang : "en";
  let condition = {
    email: req.body.data.email,
    isDeleted: false
  };
  UserDetail.find(condition).exec((err, userData) => {
    if (err) {
      
      return res.json({
        status: 404,
        msg: constants.message[defaultLang].param_missing,
        error: err
      });
    } else if (userData.length > 0) {
       
      return res.json({
        status: 404,
        msg: constants.message[defaultLang].email_exist
      }); condition
    } else {
      var data = {
        firstName: req.body.data.firstName,
        schoolName: req.body.data.schoolName ? req.body.data.schoolName : null,
        schoolDistrictName: req.body.data.schoolDistrictName ? req.body.data.schoolDistrictName : null,
        lastName: req.body.data.lastName,
        email: req.body.data.email,
        password: req.body.data.password,
        role: req.body.data.role,
        registrationToken: registrationToken,
        magicLinkToken: token,
        isSchoolConnected: req.body.data.isSchoolConnected ? req.body.data.isSchoolConnected : false
      };

      if(data.role==5){
        data = {...data, emailVerified: true};
      }

      var new_user = new UserDetail(data);
      new_user.save(function (err, result) {
        if (err) {
          return res.json({
            status: 404,
            msg: constants.message[defaultLang].param_missing,
            error: err
          });
        } else {

          if(data.role==5){
            return res.json({
              status: 200
            })
          }else{ 

            let emailData = {
              receiverEmail: req.body.data.email,
              receiverFullName: req.body.data.firstName + ' ' + req.body.data.lastName,
              subject: "Confirm email to get started!",
              replacementsObj: {//Dynamic replacements
                username: req.body.data.firstName,
                urlForConfirmRegistration: `${constant.url.frontdomain}/account-verfiy/${token}`
              },
              templateId: req.body.data.role === 6 ? constant.sendgridEmailIds.SEND_VERIFICATION_DISTRICT : (req.body.data.role === 5 ? constant.sendgridEmailIds.SEND_VERIFICATION_SCHOOL : (req.body.data.role === 2 ? constant.sendgridEmailIds.VERIFICATION_EMAIL_COUNSELOR : constant.sendgridEmailIds.VERIFICATION_EMAIL))
            }
            
            mailer(emailData).then((resultData) => { 
              let emailData = {
                  receiverEmail: process.env.ADMIN_EMAIL,
                  receiverFullName: "Admin",
                  subject: "New User Joined !",
                  replacementsObj: {//Dynamic replacements
                },
                templateId: req.body.data.role === 6 ? constant.sendgridEmailIds.SEND_ALERT_ADMIN_DISTRICT_SCHOOL : (req.body.data.role === 5 ? constant.sendgridEmailIds.SEND_ALERT_ADMIN_INDIVIDUAL_SCHOOL : (req.body.data.role === 2 ? constant.sendgridEmailIds.SEND_ALERT_ADMIN_COUNSELOR : constant.sendgridEmailIds.SEND_ALERT_ADMIN_PARENT))
              }
              mailer(emailData).then((resultData1) => {//Resolved
                return res.json({
                  status: 200,
                  msg: constants.message[defaultLang].success_register,
                });
              },
                (err) => {//Reject
                  return res.json({
                    status: "Failure",
                    code: 301,
                    msg: constants.message[defaultLang].failure_mail_forget
                  });
                });
            },
              (err) => {//Reject
                
                return res.json({
                  status: "Failure",
                  code: 301,
                  msg: constants.message[defaultLang].failure_mail_forget
                });
              });
          } 
        }
      });
    }
  })
};
 

var loginUser = async function (req, res) {
  var defaultLang = req.headers.currentlang ? req.headers.currentlang : "en";
  var userData = req.body ? req.body : {};
   
  if (userData.data.role === 2) {
    UserDetail.findOne(
      {
        email: userData.data.email,
        isDeleted: false,
      },
      function (err, user) {
        if (err) {
          return res.json(err);
        }
        if (!user) {
          return res.json({
            status: 404,
            msg: constants.message[defaultLang].invalid_email
          });
        } else {
          var password = crypto
            .pbkdf2Sync(userData.data.password, user.salt, 1000, 64, "sha512")
            .toString("hex");
          UserDetail.findOne(
            {
              email: userData.data.email,
              password: password,
              // role: userData.data.role,
              isDeleted: false
            },
            function (err, userlogin) {
              if (err) {
                return res.json(err);
              }
              if (!userlogin) {
                return res.json({
                  status: 404,
                  msg: constants.message[defaultLang].wrong_password
                });
              } else {
                UserDetail.findOne(
                  {
                    email: userData.data.email,
                    isDeleted: false,
                    // role: userData.data.role,
                    emailVerified: true
                  },
                  function (err, userlogindata) {
                    if (err) {
                      return res.json(err);
                    }
                    if (!userlogindata) {
                      return res.json({
                        status: 404,
                        msg: "Email verification is still pending. Please verify email before trying to sign in"
                      });
                    } else {
                      UserDetail.findOne(
                        {
                          email: userData.data.email,
                          isDeleted: false,
                          // role: userData.data.role,
                          emailVerified: true,
                          status: true
                        },
                        function (err, userstatus) {
                          if (err) {
                            return res.json(err);
                          }
                          if (!userstatus) {
                            return res.json({
                              status: 404,
                              msg: "Your account has been temporarily locked."
                            });
                          } else {
                            UserDetail.findOne(
                              {
                                email: userData.data.email,
                                isDeleted: false,
                                role: userData.data.role,
                                emailVerified: true,
                                status: true
                              },
                              function (err, roleData) {
                                if (err) {
                                  return res.json(err);
                                }
                                if (!roleData) {


                                  return res.json({
                                    status: 404,
                                    // msg: "You are are trying to login with wrong role. Please login from correct role."
                                    msg: "Please login as an counselor instead?"
                                  });
                                } else {
                                  UserDetail.findOne(
                                    {
                                      email: userData.data.email,
                                      isDeleted: false,
                                      role: userData.data.role,
                                      emailVerified: true,
                                      status: true,
                                      cancelStatus: false
                                    },
                                    function (err, statusDtata) {
                                      if (err) {
                                        return res.json(err);
                                      }
                                      if (!statusDtata) {
                                        return res.json({
                                          status: 404,
                                          msg: "This account has been cancelled. Contact to Guardian lane support to reconnect with us."
                                        });
                                      } else {
                                        var login_details = {
                                          _id: statusDtata._id,
                                          email: statusDtata.email,
                                          role: statusDtata.role,
                                          token: statusDtata.generateJwt(),
                                          userdetailsdata: statusDtata
                                        };
                                        UserDetail.updateOne({ _id: statusDtata._id }, {
                                          $set: {
                                            lastLoginDate: Date.now()
                                          }
                                        }, { new: true }).exec((err, resp) => {
                                            return res.json({
                                              status: 200,
                                              msg: constants.message[defaultLang].login_success,
                                              data: login_details
                                            });
                                          })
                                        
                                      }
                                    })
                                }
                              })
                          }
                        })
                    }
                  })

              }
            }
          );
        }
      }
    );
  }


  else if (userData.data.role === 5) {
     
    UserDetail.findOne(
      {
        email: userData.data.email,
        isDeleted: false,
      },
      function (err, user) {
        if (err) {
          return res.json(err);
        }
        if (!user) {
          return res.json({
            status: 404,
            msg: constants.message[defaultLang].invalid_email
          });
        } else {
          var password = crypto
            .pbkdf2Sync(userData.data.password, user.salt, 1000, 64, "sha512")
            .toString("hex");
          UserDetail.findOne(
            {
              email: userData.data.email,
              password: password,
              // role: userData.data.role,
              isDeleted: false
            },
            function (err, userlogin) {
              if (err) {
                return res.json(err);
              }
              if (!userlogin) {
                return res.json({
                  status: 404,
                  msg: constants.message[defaultLang].wrong_password
                });
              } else {
                UserDetail.findOne(
                  {
                    email: userData.data.email,
                    isDeleted: false,
                    // role: userData.data.role,
                    emailVerified: true
                  },
                  function (err, userlogindata) {
                    if (err) {
                      return res.json(err);
                    }
                    if (!userlogindata) {
                      return res.json({
                        status: 404,
                        msg: "Email verification is still pending. Please verify email before trying to sign in"
                      });
                    } else {
                      UserDetail.findOne(
                        {
                          email: userData.data.email,
                          isDeleted: false,
                          // role: userData.data.role,
                          emailVerified: true,
                          status: true
                        },
                        function (err, userstatus) {
                          if (err) {
                            return res.json(err);
                          }
                          if (!userstatus) {
                            return res.json({
                              status: 404,
                              msg: "Your account has been temporarily locked."
                            });
                          } else {
                            UserDetail.findOne(
                              {
                                email: userData.data.email,
                                isDeleted: false,
                                role: userData.data.role,
                                emailVerified: true,
                                status: true
                              },
                              function (err, roleData) {
                                if (err) {
                                  return res.json(err);
                                }
                                if (!roleData) {
                                  return res.json({
                                    status: 404,
                                    msg: "Please login as an individual school instead?"
                                  });
                                } else {
                                  UserDetail.findOne(
                                    {
                                      email: userData.data.email,
                                      isDeleted: false,
                                      role: userData.data.role,
                                      emailVerified: true,
                                      status: true,
                                      cancelStatus: false
                                    },
                                    function (err, statusDtata) {
                                      if (err) {
                                        return res.json(err);
                                      }
                                      if (!statusDtata) {
                                        return res.json({
                                          status: 404,
                                          msg: "This account has been cancelled. Contact to Guardian lane support to reconnect with us."
                                        });
                                      } else {
                                        var login_details = {
                                          _id: statusDtata._id,
                                          email: statusDtata.email,
                                          role: statusDtata.role,
                                          token: statusDtata.generateJwt(),
                                          userdetailsdata: statusDtata
                                        };
                                        UserDetail.updateOne({ _id: statusDtata._id }, {
                                          $set: {
                                            lastLoginDate: Date.now()
                                          }
                                        }, { new: true }).exec((err, resp) => {
                                          return res.json({
                                            status: 200,
                                            msg: constants.message[defaultLang].login_success,
                                            data: login_details
                                          });
                                        })
                                        
                                      }
                                    })
                                }
                              })
                          }
                        })
                    }
                  })

              }
            }
          );
        }
      }
    );
  }


  else if (userData.data.role === 6) {
    UserDetail.findOne(
      {
        email: userData.data.email,
        isDeleted: false,
      },
      function (err, user) {
        if (err) {
          return res.json(err);
        }
        if (!user) {
          return res.json({
            status: 404,
            msg: constants.message[defaultLang].invalid_email
          });
        } else {
          var password = crypto
            .pbkdf2Sync(userData.data.password, user.salt, 1000, 64, "sha512")
            .toString("hex");
          UserDetail.findOne(
            {
              email: userData.data.email,
              password: password,
              // role: userData.data.role,
              isDeleted: false
            },
            function (err, userlogin) {
              if (err) {
                return res.json(err);
              }
              if (!userlogin) {
                return res.json({
                  status: 404,
                  msg: constants.message[defaultLang].wrong_password
                });
              } else {
                UserDetail.findOne(
                  {
                    email: userData.data.email,
                    isDeleted: false,
                    // role: userData.data.role,
                    emailVerified: true
                  },
                  function (err, userlogindata) {
                    if (err) {
                      return res.json(err);
                    }
                    if (!userlogindata) {
                      return res.json({
                        status: 404,
                        msg: "Email verification is still pending. Please verify email before trying to sign in."
                      });
                    } else {
                      UserDetail.findOne(
                        {
                          email: userData.data.email,
                          isDeleted: false,
                          // role: userData.data.role,
                          emailVerified: true,
                          status: true
                        },
                        function (err, userstatus) {
                          if (err) {
                            return res.json(err);
                          }
                          if (!userstatus) {
                            return res.json({
                              status: 404,
                              msg: "Your account has been temporarily locked."
                            });
                          } else {
                            UserDetail.findOne(
                              {
                                email: userData.data.email,
                                isDeleted: false,
                                role: userData.data.role,
                                emailVerified: true,
                                status: true
                              },
                              function (err, roleData) {
                                if (err) {
                                  return res.json(err);
                                }
                                if (!roleData) {
                                  return res.json({
                                    status: 404,
                                    msg: "Please login as an school district instead?"
                                  });
                                } else {
                                  UserDetail.findOne(
                                    {
                                      email: userData.data.email,
                                      isDeleted: false,
                                      role: userData.data.role,
                                      emailVerified: true,
                                      status: true,
                                      cancelStatus: false
                                    },
                                    function (err, statusDtata) {
                                      if (err) {
                                        return res.json(err);
                                      }
                                      if (!statusDtata) {
                                        return res.json({
                                          status: 404,
                                          msg: "This account has been cancelled. Contact to Guardian lane support to reconnect with us."
                                        });
                                      } else {
                                        var login_details = {
                                          _id: statusDtata._id,
                                          email: statusDtata.email,
                                          role: statusDtata.role,
                                          token: statusDtata.generateJwt(),
                                          userdetailsdata: statusDtata
                                        };
                                        UserDetail.updateOne({ _id: statusDtata._id }, {
                                          $set: {
                                            lastLoginDate: Date.now()
                                          }
                                        }, { new: true }).exec((err, resp) => {
                                          return res.json({
                                            status: 200,
                                            msg: constants.message[defaultLang].login_success,
                                            data: login_details
                                          });
                                        })
                                        
                                      }
                                    })
                                }
                              })
                          }
                        })
                    }
                  })

              }
            }
          );
        }
      }
    );
  }

  else if (userData.data.role === 8) {
    console.log(userData.data)
    UserDetail.findOne(
      {
        email: userData.data.email,
        isDeleted: false,
      },
      function (err, user) {
        if (err) {
          return res.json(err);
        }
        if (!user) {
          return res.json({
            status: 404,
            msg: constants.message[defaultLang].invalid_email
          });
        } else {
          var password = crypto
            .pbkdf2Sync(userData.data.password, user.salt, 1000, 64, "sha512")
            .toString("hex");
          UserDetail.findOne(
            {
              email: userData.data.email,
              password: password,
              // role: userData.data.role,
              isDeleted: false
            },
            function (err, userlogin) {
              if (err) {
                return res.json(err);
              }
              if (!userlogin) {
                return res.json({
                  status: 404,
                  msg: constants.message[defaultLang].wrong_password
                });
              } else {
                UserDetail.findOne(
                  {
                    email: userData.data.email,
                    isDeleted: false,
                    // role: userData.data.role,
                    emailVerified: true
                  },
                  function (err, userlogindata) {
                    if (err) {
                      return res.json(err);
                    }
                    if (!userlogindata) {
                      return res.json({
                        status: 404,
                        msg: "Email verification is still pending. Please verify email before trying to sign in."
                      });
                    } else {
                      UserDetail.findOne(
                        {
                          email: userData.data.email,
                          isDeleted: false,
                          // role: userData.data.role,
                          emailVerified: true,
                          status: true
                        },
                        function (err, userstatus) {
                          if (err) {
                            return res.json(err);
                          }
                          if (!userstatus) {
                            return res.json({
                              status: 404,
                              msg: "Your account has been temporarily locked."
                            });
                          } else {
                            UserDetail.findOne(
                              {
                                email: userData.data.email,
                                isDeleted: false,
                                role: userData.data.role,
                                emailVerified: true,
                                status: true
                              },
                              function (err, roleData) {
                                if (err) {
                                  return res.json(err);
                                }
                                if (!roleData) {
                                  return res.json({
                                    status: 404,
                                    msg: "Please login as an school district instead?"
                                  });
                                } else {
                                  UserDetail.findOne(
                                    {
                                      email: userData.data.email,
                                      isDeleted: false,
                                      role: userData.data.role,
                                      emailVerified: true,
                                      status: true,
                                      cancelStatus: false
                                    },
                                    function (err, statusDtata) {
                                      if (err) {
                                        return res.json(err);
                                      }
                                      if (!statusDtata) {
                                        return res.json({
                                          status: 404,
                                          msg: "This account has been cancelled. Contact to Guardian lane support to reconnect with us."
                                        });
                                      } else {
                                        var login_details = {
                                          _id: statusDtata._id,
                                          email: statusDtata.email,
                                          role: statusDtata.role,
                                          token: statusDtata.generateJwt(),
                                          userdetailsdata: statusDtata
                                        };
                                        UserDetail.updateOne({ _id: statusDtata._id }, {
                                          $set: {
                                            lastLoginDate: Date.now()
                                          }
                                        }, { new: true }).exec((err, resp) => {
                                          return res.json({
                                            status: 200,
                                            msg: constants.message[defaultLang].login_success,
                                            data: login_details
                                          });
                                        })
                                        
                                      }
                                    })
                                }
                              })
                          }
                        })
                    }
                  })

              }
            }
          );
        }
      }
    );
  }


  else if (userData.data.role === 3) {
    UserDetail.findOne(
      {
        email: userData.data.email,
        isDeleted: false,
      },
      function (err, user) {
        if (err) {
          return res.json(err);
        }
        if (!user) {
          return res.json({
            status: 404,
            msg: constants.message[defaultLang].invalid_email
          });
        } else {
          UserDetail.findOne(
            {
              email: userData.data.email,
              isDeleted: false,
              // role: userData.data.role,
              emailVerified: true
            },
            function (err, userlogindata) {
              if (err) {
                return res.json(err);
              }
              if (!userlogindata) {
                return res.json({
                  status: 404,
                  msg: "Email verification is still pending. Please verify email before trying to sign in."
                });
              } else {
                UserDetail.findOne(
                  {
                    email: userData.data.email,
                    isDeleted: false,
                    // role: userData.data.role,
                    emailVerified: true,
                    status: true
                  },
                  function (err, userstatus) {
                    if (err) {
                      return res.json(err);
                    }
                    if (!userstatus) {
                      return res.json({
                        status: 404,
                        msg: "Your account has been temporarily locked."
                      });
                    } else {


                      UserDetail.findOne(
                        {
                          email: userData.data.email,
                          isDeleted: false,
                          role: userData.data.role,
                          emailVerified: true,
                          status: true
                        },
                        function (err, roleData) {
                          if (err) {
                            return res.json(err);
                          }
                          if (!roleData) {
                            return res.json({
                              status: 404,
                              msg: "Please login as an parent  instead?"
                            });
                          } else {
                            UserDetail.findOne(
                              {
                                email: userData.data.email,
                                isDeleted: false,
                                role: userData.data.role,
                                emailVerified: true,
                                status: true,
                                cancelStatus: false
                              },
                              function (err, statusData) {
                                if (err) {
                                  return res.json(err);
                                }
                                if (!statusData) {
                                  return res.json({
                                    status: 404,
                                    msg: "This account has been cancelled. Contact to Guardian lane support to reconnect with us."
                                  });
                                } else {
                                  // var token = crypto.randomBytes(25).toString("hex");
                                  var token = jwt.sign({ id: statusData._id }, mySecret, {
                                    expiresIn: 200000000000//expires in 20000 secound                                                                        
                                  });

                                  UserDetail.update(
                                    { email: statusData.email },
                                    { $set: { magicLinkToken: token, lastLoginDate: Date.now() } },
                                    function (err, result) {
                                      if (err) {
                                        return res.json({
                                          status: "Failure",
                                          code: 301,
                                          msg: constants.message[defaultLang].error_update_forget_token
                                        });
                                      } else {
                                        let emailData = {
                                          receiverEmail: statusData.email,
                                          receiverFullName: statusData.firstName + ' ' + statusData.lastName,
                                          subject: "Login with magic link!",
                                          replacementsObj: {//Dynamic replacements
                                            username: statusData.firstName,
                                            urlForMagicLink: `${constant.url.frontdomain}/dashboard/${token}`
                                          },
                                          templateId: constant.sendgridEmailIds.MAGIC_LINK
                                        }
                                        // var mailerin = new mailer();
                                        mailer(emailData).then((resultData) => {//Resolved
                                          return res.json({
                                            status: 200,
                                            msg: "A magic link has been sent in your email. Link will be expire in 5 mins. Kindly use that link to login.",
                                            // data: login_details
                                          });
                                        },
                                          (err) => {//Reject
                                            return res.json({
                                              status: "Failure",
                                              code: 301,
                                              msg: constants.message[defaultLang].failure_mail_forget
                                            });
                                          });

                                      }
                                    }
                                  );
                                }
                              })
                          }
                        })



                    }
                  })
              }
            })
        }
      }
    );
  }
  else if (userData.data.role === 7) {
    
    if(userData.data.token){
     
      await jwt.verify(userData.data.token, mySecret, function (err, decoded) {
          if(err){
            return res.json({
              status: 404,
              msg: err.message
            });  
          }else{
            userData.data.guardianEmail = decoded.guardianEmail;
            userData.data.studentPassword = decoded.studentName;
          } 
      });
    }
    
    UserDetail.findOne(
      {
        "studentInfo.guardianEmail":userData.data.guardianEmail ,
        "studentInfo.studentPassword":userData.data.studentPassword,
        isDeleted: false,
        role: 5,
        emailVerified: true,
        status: true,
        cancelStatus: false,
      },
      {
        studentInfo:{
          $elemMatch: {
            'guardianEmail': userData.data.guardianEmail,
            'studentPassword': userData.data.studentPassword,
            "status": true,
            "role": userData.data.role
          }
        }
      },
       
    function (err, userlogin) {
       
      if (err) {
        return res.json({
          status: 404,
          msg: constants.message[defaultLang].wrong_password
        });
      }
         
        if (!userlogin) {
          return res.json({
            status: 404,
            msg: constants.message[defaultLang].invalid_login_credential
          });
        } else {
           
            if (userlogin.studentInfo[0].role === 7) {
              var login_details = {
                _id: userlogin._id,
                email: userlogin.studentInfo[0].guardianEmail,
                role: 7,
                token: userlogin.generateJwt(),
                studentData: userlogin.studentInfo,
                userdetailsdata: userlogin
              };
            }
            else {
              var login_details = {
                _id: userlogin._id,
                email: userlogin.guardianEmail,
                role: 4,
                token: userlogin.generateJwt(),
                childData: userlogin.childInfo,
                userdetailsdata: userlogin
              };
            }

            UserDetail.updateOne(
              {
                "studentInfo._id": userlogin._id
              }, 
              {
              $set: {
                'studentInfo.$.lastLoginDate': Date.now()
              }
            }, { new: true }).exec((err, resp) => {

              if (err) {
                return res.json({
                  status: 404,
                  msg: constants.message[defaultLang].default_error,
                });
              }
              
              return res.json({
                status: 200,
                msg: constants.message[defaultLang].login_success,
                data: login_details
              });
            })
            
        }
    },
      
    );





  }
  else if (userData.data.role === 4) {
    UserDetail.findOne(
      {
        email: userData.data.email,
        isDeleted: false,
      },
      function (err, user) {
        if (err) {
          return res.json(err);
        }
        if (!user) {
          return res.json({
            status: 404,
            msg: constants.message[defaultLang].invalid_email
          });
        } else {
          UserDetail.findOne(
            {
              email: userData.data.email,
              "childInfo.nickName": req.body.data.username,
              isDeleted: false,
            },
            function (err, user) {
              if (err) {
                return res.json(err);
              }
              if (!user) {
                return res.json({
                  status: 404,
                  msg: "Name error didn't match. Please try  again."
                });
              } else {
                var password = crypto
                  .pbkdf2Sync(userData.data.password, user.salt, 1000, 64, "sha512")
                  .toString("hex");
                UserDetail.findOne(
                  {
                    email: userData.data.email,
                    password: password,
                    "childInfo.nickName": req.body.data.username,
                    // role: userData.data.role,
                    isDeleted: false
                  },
                  function (err, userlogin) {
                    if (err) {
                      return res.json(err);
                    }
                    if (!userlogin) {
                      return res.json({
                        status: 404,
                        msg: constants.message[defaultLang].wrong_password
                      });
                    } else {
                      UserDetail.findOne(
                        {
                          email: userData.data.email,
                          isDeleted: false,
                          "childInfo.nickName": req.body.data.username,
                          // role: userData.data.role,
                          emailVerified: true
                        },
                        function (err, userlogindata) {
                          if (err) {
                            return res.json(err);
                          }
                          if (!userlogindata) {
                            return res.json({
                              status: 404,
                              msg: "Parent email not verified. Please verify your email first."
                            });
                          } else {
                            UserDetail.findOne(
                              {
                                email: userData.data.email,
                                isDeleted: false,
                                "childInfo.nickName": req.body.data.username,
                                // role: userData.data.role,
                                emailVerified: true,
                                status: true
                              },
                              function (err, userstatus) {
                                if (err) {
                                  return res.json(err);
                                }
                                if (!userstatus) {
                                  return res.json({
                                    status: 404,
                                    msg: "Parent account has been temporarily locked."
                                  });
                                } else {
                                  UserDetail.findOne(
                                    {
                                      email: userData.data.email,
                                      "childInfo.nickName": req.body.data.username,
                                      isDeleted: false,
                                      role: 3,
                                      emailVerified: true,
                                      status: true
                                    },
                                    function (err, roleData) {
                                      if (err) {
                                        return res.json(err);
                                      }
                                      if (!roleData) {
                                        return res.json({
                                          status: 404,
                                          msg: "Please login as an child instead?"
                                        });
                                      } else {
                                        UserDetail.findOne(
                                          {
                                            email: userData.data.email,
                                            "childInfo.nickName":req.body.data.username ,
                                            isDeleted: false,
                                            role: 3,
                                            emailVerified: true,
                                            status: true,
                                            cancelStatus: false,
                                            
                                          },
                                          {
                                            'childInfo':{
                                              $elemMatch: {
                                                'nickName': req.body.data.username
                                              }
                                            }
                                          },
                                          function (err, statusDtata) {
                                            if (err) {
                                              return res.json(err);
                                            }
                                            if (!statusDtata) {
                                              return res.json({
                                                status: 404,
                                                msg: "Your parent account has been cancelled. Contact to Guardian lane support to reconnect with us."
                                              });
                                            } else {
                                              
                                              
                                              var login_details = {
                                                _id: statusDtata._id,
                                                email: statusDtata.email,
                                                role: 4,
                                                token: statusDtata.generateJwt(),
                                                childData: statusDtata.childInfo,
                                                userdetailsdata: statusDtata,
                                              };
                                              UserDetail.update({
                                                _id:statusDtata._id,  
                                                childInfo : { 
                                                    $elemMatch: { 
                                                      '_id': statusDtata.childInfo[0]._id
                                                    }
                                                  },
                                                  
                                                }, 
                                                {
                                                  $set: {
                                                    'childInfo.$.lastLoginDate': Date.now()
                                                  }
                                              }, { new: true }).exec((err, resp) => {
                                                 
                                                if (err) {
                                                  return res.json({
                                                    status: 404,
                                                    msg: "Something went wrong!"
                                                  });
                                                }
                                                return res.json({
                                                  status: 200,
                                                  msg: constants.message[defaultLang].login_success,
                                                  data: login_details
                                                });
                                              })
                                              
                                            }
                                          })
                                      }
                                    })
                                }
                              })
                          }
                        })
                    }
                  }
                );

              }
            }
          )


        }
      }
    );
  }

};
 
var getUserData = function (req, res) {
  
  
  var defaultLang = req.headers.currentlang ? req.headers.currentlang : "en";
 
  UserDetail.findOne(
    {
      _id: req.body.user_params._id,
      isDeleted: false,
    },
    function (err, user) {
      
      if (err) {
        return res.json({
          status: 301,
          msg: constants.message[defaultLang].default_error
        });
      }
      else {
        return res.json({
            status: 200,
            msg: "User data fetched successfully",
            data: user
          });
      }
    })
};

var forgotPassword = function (req, res) {
  var defaultLang = req.headers.currentlang ? req.headers.currentlang : "en";
  var data = req.body.data ? req.body.data : {};
  data.email = data.email;
  if (!validator.validate(data.email)) {
    return res.json({
      status: "Failure",
      code: 301,
      msg: constants.message[defaultLang].valid_email
    });
  }
  if (data.role === 7) {

    UserDetail.findOne({ "studentInfo.guardianEmail": data.email, isDeleted: false }, function (
      err,
      userDetailsData
    ) {
      if (err) {
        return res.json({
          status: "Failure",
          code: 301,
          msg: constants.message[defaultLang].default_error
        });
      }
      else if (!userDetailsData) {
        return res.json({
          status: "Failure",
          code: 301,
          msg: constants.message[defaultLang].invalid_email
        });
      }
      else {
         
        var token = crypto.randomBytes(25).toString("hex");
        UserDetail.update(
          { "studentInfo.guardianEmail": data.email },
          { $set: { "studentInfo.$.forgot_password_token": token } },
          function (err, result) {
            if (err) {
              return res.json({
                status: "Failure",
                code: 301,
                msg: constants.message[defaultLang].error_update_forget_token
              });
            } else {
              let emailData = {
                receiverEmail: data.email,
                //receiverFullName: StatusData.guardianName ,
                subject: "Forgot Password",
                replacementsObj: {//Dynamic replacements
                  //username: StatusData.guardianName,
                  urlForResetPassword: `${constant.url.frontdomain}/reset-password-student/${token}`
                },
                templateId: constant.sendgridEmailIds.FORGOT_PASSWORD

              }
              mailer(emailData).then((resultData) => {//Resolved
                return res.json({
                  status: 200,
                  msg: constants.message[defaultLang].success_mail_forget
                });
              },
                (err) => {//Reject
                  return res.json({
                    status: "Failure",
                    code: 301,
                    msg: constants.message[defaultLang].failure_mail_forget
                  });
                });

            }
          }
        );
      }

    });

  }
  else {
    UserDetail.findOne({ email: data.email, isDeleted: false }, function (
      err,
      userDetailsData
    ) {
      if (err) {
        return res.json({
          status: "Failure",
          code: 301,
          msg: constants.message[defaultLang].default_error
        });
      }
      else if (!userDetailsData) {
        return res.json({
          status: "Failure",
          code: 301,
          msg: constants.message[defaultLang].invalid_email
        });
      }
      else {
         
        UserDetail.findOne({ email: data.email, isDeleted: false, emailVerified: true }, function (
          err,
          verifiedData
        ) {
          if (err) {
            return res.json({
              status: "Failure",
              code: 301,
              msg: constants.message[defaultLang].default_error
            });
          }
          if (!verifiedData) {
            return res.json({
              status: "Failure",
              code: 301,
              msg: "Your email is not verified. Please verify your email first."
            });
          }
          else {
            UserDetail.findOne({ email: data.email, isDeleted: false, emailVerified: true, status: true }, function (
              err,
              StatusData
            ) {
              if (err) {
                return res.json({
                  status: "Failure",
                  code: 301,
                  msg: constants.message[defaultLang].default_error
                });
              }
              if (!StatusData) {
                return res.json({
                  status: "Failure",
                  code: 301,
                  msg: "Your account has been temporarily locked."
                });
              }
              else {

                var token = crypto.randomBytes(25).toString("hex");
                UserDetail.update(
                  { email: data.email },
                  { $set: { forgot_password_token: token } },
                  function (err, result) {
                    if (err) {
                      return res.json({
                        status: "Failure",
                        code: 301,
                        msg: constants.message[defaultLang].error_update_forget_token
                      });
                    } else {

                      let emailData = {
                        receiverEmail: StatusData.email,
                        receiverFullName: StatusData.firstName + ' ' + StatusData.lastName,
                        subject: "Forgot Password",
                        replacementsObj: {//Dynamic replacements
                          username: StatusData.firstName,
                          urlForResetPassword: `${constant.url.frontdomain}/reset-password/${token}`
                        },
                        templateId: constant.sendgridEmailIds.FORGOT_PASSWORD

                      }
                      mailer(emailData).then((resultData) => {//Resolved
                        return res.json({
                          status: 200,
                          msg: constants.message[defaultLang].success_mail_forget
                        });
                      },
                        (err) => {//Reject
                          return res.json({
                            status: "Failure",
                            code: 301,
                            msg: constants.message[defaultLang].failure_mail_forget
                          });
                        });

                    }
                  }
                );
              }
            });
          }
        });
      }

    });
  }
  // });
};

var accountVerification = function (req, res) {
  var defaultLang = req.headers.currentlang ? req.headers.currentlang : "en";
  UserDetail.updateOne({ magicLinkToken: req.body.token, isDeleted: false }, {
    $set: {
      emailVerified: true
    }
  }, { new: true }).exec((err, resp) => {
    if (resp) {
      UserDetail.findOne({ magicLinkToken: req.body.token, isDeleted: false, status: true, cancelStatus: false }).exec((err, resp) => {
        if (resp) {
          var login_details = {
            _id: resp._id,
            email: resp.email,
            role: resp.role,
            token: resp.generateJwt(),
            userdetailsdata: resp
          };
          return res.json({
            status: 200,
            msg: "Your account is verified successfully.",
            data: login_details
          });
        }
        else {
          return res.json({
            status: 500,
            msg: "Link is not valid. Kindly send another link to login."
          });
        }
      })
    }
    else {
      return res.json({
        status: 500,
        msg: constants.message[defaultLang].error_update
      });
    }
  })
}

var resetPassword = function (req, res) {
   
  var defaultLang = req.headers.currentlang ? req.headers.currentlang : "en";
  UserDetail.findOne({ forgot_password_token: req.body.token, isDeleted: false }, function (
    err,
    user
  ) {
    if (user) {
      user.salt = crypto.randomBytes(16).toString("hex");
      user.password = crypto
        .pbkdf2Sync(req.body.password, user.salt, 1000, 64, "sha512")
        .toString("hex");

      UserDetail.updateOne({ forgot_password_token: req.body.token, isDeleted: false }, {
        $set: {
          password: user.password,
          salt: user.salt,
          forgot_password_token: null
        }
      }, { new: true }).exec((err, result) => {
        if (err) {
          return res.json({
            status: 400,
            msg: "Password did not updated. Please try again."
          })
        }
        else {

          mailer({
            receiverEmail: user.email,
            receiverFullName: user.firstName,
            subject: "Your Password Changed!",
            replacementsObj: {//Dynamic replacements
              date: new Date().toLocaleDateString(),
              time: new Date().toLocaleTimeString(),
              username: user.firstName,
            },
            templateId: constant.sendgridEmailIds.PASSWORD_CHANGED_NOTIFICAION
            
          }).then(res=>{});

          return res.json({
            status: 200,
            msg: "Password updated successfully."
          })
        }
      })
    } else {
      return res.json({
        status: 404,
        msg: "No user found for forgot password."
      });
    }
  })
};
  

var uploadImage = function (req, res) {
  var defaultLang = req.headers.currentlang ? req.headers.currentlang : "en";
  let folderName = req.body.contestName ? req.body.contestName : "profileImages"
  let imageUploadDirectoryName = "./public/" + folderName;
  if (!fs.existsSync(imageUploadDirectoryName)) {
    fs.mkdirSync(imageUploadDirectoryName);
  }
  let uploadedFilesDetails;
  const date = new Date();
  const currentDate = date.valueOf();
  const randomStr = Math.floor(Math.random() * 10000 + 99999);
  const name = randomStr + "-" + currentDate;
  let form = new formidable.IncomingForm();
  // form.uploadDir = imageUploadDirectoryName;
  form.keepExtensions = true;
  form.maxFileSize = 1000 * 1024 * 1024;
  form.maxFieldsSize = 10 * 1024 * 1024;
  form.multiples = true;
  form.parse(req, async function (err, fields, files) {
    if (err) {
      return res.json({
        status: "Failure",
        code: 500,
        msg: constants.message[defaultLang].default_error
      });
    } else {
      let resumePath;
      // let pathArr = files.profileImage.path.split("/");
      uploadedFilesDetails = {
        name: files.profileImage.name,
        path: files.profileImage.path,
        type: files.profileImage.type,
        key: "profileImages/" + name
      }
      await awsUploader
        .uploadSingleFile(uploadedFilesDetails)
        .then(result => {
          resumePath = result.Location
        })
       
      
      UserDetail.updateOne({ _id: req.body.user_params._id }, {
        $set: {
          image: resumePath,
        }
      }, { new: true }).exec((err, resp) => {
        if (resp) {

          videoUpload.updateOne(
            { postCreateId: req.body.user_params._id, isDeleted: false },
            {
              $set: {
                image: resumePath
              }
            }, { multi: true },
            (err, resp) => {
              if (resp) {
                if (fields.role === "2") {
                  chatlistDetails.updateMany({ counselorId: req.body.user_params._id }, {
                    $set: {
                      counselorImage: resumePath,
                    }
                  }, { multi: true }).exec((err, resp) => {
                    if (err) {
                      return res.json({
                        status: 500,
                        msg: constants.message[defaultLang].error_update
                      });
                    } else {
                      sessionBookedDetails.updateMany({ counselorId: req.body.user_params._id }, {
                        $set: {
                          counselorImage: resumePath,
                        }
                      }, { multi: true }).exec((err, resp) => {
                        if (err) {
                          return res.json({
                            status: 500,
                            msg: constants.message[defaultLang].error_update
                          });
                        } else {
                          return res.json({
                            status: 200,
                            msg: "Profile image updated sucessfully."
                          });
                        }
                      })
                    }
                  })
                } else if (fields.role === "3") {
                  chatlistDetails.updateMany({ parentId: req.body.user_params._id }, {
                    $set: {
                      parentImage: resumePath,
                    }
                  }, { multi: true }).exec((err, resp) => {
                    if (err) {
                      return res.json({
                        status: 500,
                        msg: constants.message[defaultLang].error_update
                      });
                    } else {
                      sessionBookedDetails.updateMany({ parentId: req.body.user_params._id }, {
                        $set: {
                          parentImage: resumePath,
                        }
                      }, { multi: true }).exec((err, resp) => {
                        if (err) {
                          return res.json({
                            status: 500,
                            msg: constants.message[defaultLang].error_update
                          });
                        } else {
                          return res.json({
                            status: 200,
                            msg: "Profile image updated sucessfully."
                          });
                        }
                      })
                    }
                  })
                }else{
                  return res.json({
                    status: 200,
                    msg: "Profile image updated sucessfully."
                  });
                }



              } else {
                return res.json({
                  status: "Failure",
                  code: 500,
                  msg: constants.message[defaultLang].default_error
                });
              }
            }
          );
           
        }
        else {
          return res.json({
            status: 500,
            msg: constants.message[defaultLang].error_update
          });
        }
      })
    }
  })
}

 
var cancelAccount = function (req, res) {
  if (req.body.data.role === 2) {
    UserDetail.update(
      {
        _id: req.body.user_params._id,
        isDeleted: false,
      },
      {
        $set: {
          cancelStatus: true,
          cancelReason: req.body.data.reason,
          recommendation: req.body.data.recommendation,
          commingBackIntrest: req.body.data.intrest
        }
      },
      function (err, result) {
        if (err) {
          res.json({
            status: 500,
            msg: constants.message[defaultLang].error_update_password
          });
        } else {
          res.json({
            status: 200,
            msg: "Your account has been cancelled succsessfully. Please visit us again!"

          });

          // logCtrl.create(user._id, { en: 'Password changed successfully', de: 'das Passwort wurde erfolgreich geändert' }, 'account');
        }
      }
    );
  } else if (req.body.data.role === 3) {
    UserDetail.update(
      {
        _id: req.body.user_params._id,
        isDeleted: false,
      },
      {
        $set: {
          cancelStatus: true,
          cancelReason: req.body.data.reason,
          recommendation: req.body.data.recommendation,
          commingBackIntrest: req.body.data.intrest,
          childrenEnjoy: req.body.data.childrenEnjoy,
          isSessionWithCounselor: req.body.data.isSessionWithCounselor,
          improveSite: req.body.data.improveSite,
        }
      },
      function (err, result) {
        if (err) {
          res.json({
            status: 500,
            msg: constants.message[defaultLang].error_update_password
          });
        } else {
          res.json({
            status: 200,
            msg: "Your account has been cancelled succsessfully. Please visit us again!"

          });

          // logCtrl.create(user._id, { en: 'Password changed successfully', de: 'das Passwort wurde erfolgreich geändert' }, 'account');
        }
      }
    );
  } else if (req.body.data.role === 5) {
    UserDetail.update(
      {
        _id: req.body.user_params._id,
        isDeleted: false,
      },
      {
        $set: {
          cancelStatus: true,
          cancelReason: req.body.data.reason,
          childrenEnjoy: req.body.data.childrenEnjoy,
          commingBackIntrest: req.body.data.intrest,
          isSessionWithCounselor: req.body.data.isSessionWithCounselor,
          //recommendation: req.body.data.recommendation,
          improveSite: req.body.data.improveSite,
        }
      },
      function (err, result) {
        if (err) {
          res.json({
            status: 500,
            msg: constants.message[defaultLang].error_update_password
          });
        } else {
          res.json({
            status: 200,
            msg: "Your account has been cancelled succsessfully. Please visit us again!"
        });

          // logCtrl.create(user._id, { en: 'Password changed successfully', de: 'das Passwort wurde erfolgreich geändert' }, 'account');
        }
      }
    );
  }
}
 


 


  
 

 

var logout = function (req, res) {
  UserDetail
    .updateOne(
      { _id: req.body.data },
      {
        $set: {
          magicLinkToken: null,
        }
      }
    )
    .exec((err, resp1) => {
      if (resp1) {
        return res.json({
          status: 200,
          msg: "Child data updated successfully."
        });
      } else {
        return res.json({
          status: "Failure",
          code: 500,
          msg: constants.message[defaultLang].default_error
        });
      }
    });
}


var addSchool = function (req, res) {
  var defaultLang = 'en';
  let registrationToken = crypto.randomBytes(25).toString("hex");
  var token = crypto.randomBytes(25).toString("hex");
  let condition = {
    email: req.body.data.email,
    isDeleted: false
  };

  
  UserDetail.find(condition).exec((err, userData) => {
    if (err) {
      return res.json({
        status: 404,
        msg: constants.message[defaultLang].param_missing,
        error: err
      });
    } else if (userData.length > 0) {
      return res.json({
        status: 404,
        msg: "Email already registered"
      }); condition
    } else {

      var data = {
        firstName: req.body.data.mainContactName,
        schoolName: req.body.data.schoolName ? req.body.data.schoolName : null,
        schoolDistrictName: req.body.data.schoolDistrictName ? req.body.data.schoolDistrictName : null,
        schoolDistrictId: req.body.data.schoolDistrictId,
        districtConnected: true,
        address: req.body.data.address,
        city: req.body.data.city,
        state: req.body.data.state,
        mainContactName: req.body.data.mainContactName,
        mainContactPhone: req.body.data.mainContactPhone,
        mainContactSchoolNumber: req.body.data.mainContactSchoolNumber,
        schoolGradeLevel: req.body.data.schoolGradeLevel,

        // lastName: req.body.data.lastName,
        email: req.body.data.email,
        password: req.body.data.password,
        role: req.body.data.role,
        registrationToken: registrationToken,
        magicLinkToken: token,
        stepOneVerificationSchoolIndividual: true,
        stepTwoVerificationSchoolIndividual: true,
        emailVerified: true,
        finalStepVerified: true,

      };

      var new_user = new UserDetail(data);
      new_user.save(function (err, result) {
        if (err) {
          
          return res.json({
            status: 404,
            msg: constants.message[defaultLang].param_missing,
            error: err
          });
        } else {

 
          let emailData = {
            receiverEmail: req.body.data.email,
            receiverFullName: req.body.data.mainContactName,
            // receiverFullName: result.username,
            subject: "Registration at Guardian Lane  !",
            replacementsObj: {//Dynamic replacements
              name: req.body.data.firstName,
              schoolDistrictName: req.body.data.schoolDistrictName,
              username: req.body.data.email,
              password: req.body.data.password,
              mainContactName: req.body.data.mainContactName
            },
            templateId: constant.sendgridEmailIds.ALERT_SCHOOL_DISTRICT_SCHOOL_SIGNUP


          }
          mailer(emailData).then((resultData1) => {//Resolved
          },
          )


          return res.json({
            status: 200,
            msg: "SchoolData data added successfully."
          });

        }
      });
    }
  })



}

var updateSchoolInfo = function (req, res) {
  var defaultLang= 'en';
  let condition = {
    _id: req.body.data.schoolId,
    schoolDistrictId: req.body.user_params._id
  };
  
  UserDetail.find(condition).exec((err, childData) => {
    if (err) {
      return res.json({
        status: "Failure",
        code: 500,
        msg: constants.message[defaultLang].default_error
      });
    } else if (childData.length > 0) {
      UserDetail
        .updateOne(
          { _id: req.body.data.schoolId },
          {
            $set: {
              schoolName: req.body.data.schoolName,
              address: req.body.data.address,
              city: req.body.data.city,
              state: req.body.data.state,
              //email: req.body.data.email,
              schoolGradeLevel: req.body.data.schoolGradeLevel,
              mainContactName: req.body.data.mainContactName,
              mainContactPhone: req.body.data.mainContactPhone,
              mainContactSchoolNumber: req.body.data.mainContactSchoolNumber,
            },
          },
          { runValidators: true }
        )
        .exec((err, resp) => {
          if (resp) {
            UserDetail
              .updateOne(
                { _id: req.body.user_params._id, },
                {
                  $set: {
                    childLoose: req.body.data.childLoose,
                  }
                }
              )
              .exec((err, resp1) => {
                if (resp1) {
                  return res.json({
                    status: 200,
                    msg: "School data updated successfully."
                  });
                } else {
                  return res.json({
                    status: "Failure",
                    code: 500,
                    msg: constants.message[defaultLang].default_error
                  });
                }
              });
          } else {
            return res.json({
              status: "Failure",
              code: 500,
              msg: "This email is already registered in the system."
            });
          }
        });
    }
  });
}

var deleteSchoolData = function (req, res) {
  let condition = { _id: req.body.data.schoolId, schoolDistrictId: req.body.user_params._id};
  UserDetail
    .findByIdAndDelete(condition, {
      _id: mongoose.Types.ObjectId(req.body.data.schoolId)
    })
    .exec((err, childData) => {
      if (err) {
        return res.json({
          status: "Failure",
          code: 500,
          msg: "Something went wrong"
        });
      } else {
        return res.json({
          status: 200,
          msg: "School record deleted successfully."
        });
      }
    });
}

var getDistrictSchools = async function (req, res) {

  var defaultLang = req.headers.currentlang ? req.headers.currentlang : "en";
  let pageNumber = req.body.data.pageNumber,
      limit = parseInt(req.body.data.limit),
      skip = (parseInt(pageNumber) - 1) * parseInt(limit),
      isSearching = req.body.data.searchingData ? req.body.data.searchingData : false,
      searchingData = req.body.data.searchingData,
      regex = new RegExp(searchingData, "i");
  await UserDetail.find({ role: 5, districtConnected: true, schoolDistrictId: mongoose.Types.ObjectId(req.body.user_params._id) }).exec(function (err, schoolData) {
      if (err) {
          res.json({
              status: 500
          });
      } else {
          
          if (isSearching) {
              UserDetail.find({ role: 5, districtConnected: true, schoolDistrictId: mongoose.Types.ObjectId(req.body.user_params._id), schoolName: regex })
                  .exec((err, data) => {
                      if (err) {
                          return res.json({
                              status: 500
                          });
                      } else {
                          return res.json({
                              status: 200,
                              msg: constant.message[defaultLang].successRetreivingData,
                              data: { data }
                          });
                      }
              });
          } else {
              // Used while not searching
              UserDetail.find({ role: 5, districtConnected: true, schoolDistrictId: mongoose.Types.ObjectId(req.body.user_params._id) })
                  .exec((err, data) => {
                      if (err) {
                          return res.json({
                              status: 500
                          });
                      } else {
                          return res.json({
                              status: 200,
                              msg: constant.message[defaultLang].successRetreivingData,
                              data: { data }
                          });
                      }
                  });
          }
      }
  })

}
 

exports.createAccount = createAccount;
exports.loginUser = loginUser;
exports.getUserData = getUserData;
exports.forgotPassword = forgotPassword;
exports.accountVerification = accountVerification;
exports.resetPassword = resetPassword;
exports.uploadImage = uploadImage;
exports.cancelAccount = cancelAccount;
exports.logout = logout;

exports.addSchool = addSchool;
exports.updateSchoolInfo = updateSchoolInfo;
exports.deleteSchoolData = deleteSchoolData;
exports.getDistrictSchools = getDistrictSchools;


 
 