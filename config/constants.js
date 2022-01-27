module.exports = {
  url: {
    frontdomain: process.env.FRONT_DOMAIN,
    serverdomain: process.env.SERVER_DOMAIN
  },

  sandgridEmailDetails: {
    fromEmail: process.env.SENDER_EMAIL,
    fromFullName: "Guardian Lane",
    SENDGRID_API_CLIENT: process.env.SENDGRID_API_KEY
},


sendgridEmailIds  : {
    VERIFICATION_EMAIL:"d-36dce4fdcca8413499515dc11f5d244c",
    FORGOT_PASSWORD : "d-85a4961c29cd45b297f07317982cc9fd",
    MAGIC_LINK : "d-1fc650b3d9c340e1856fac02ab99077d",
    VERIFICATION_EMAIL_COUNSELOR: "d-e0fa19db1dbd48c68da64f01341687be",
    VIDEO_UPLOAD_APPROVE: "d-528e14be5315414a9f5cfda506dadde2",
    VIDEO_UPLOAD_DECLINE: "d-cb59fa3000a04e60bc06bab457c08303",
    NO_VIDEO_UPLOAD: "d-f812402544d745f4968b1fbe1c98d944",
    HIGH_DEMAND: "d-ffe7ea47a8a34042b4167434a4574618",
    SET_FLAG: "d-5658c40d49b24beaad6083baf4f09fa3",
    VIDEO_UPLOADED_ADMIN: "d-c6aba152bae94492a4e3e342ebffd6a2",
    NOT_UPLOADED_FIVE: "d-be1ab01535ae49f99a83e448bd400eed",
    NOT_SIGN_UP: "d-add560faf1b847e090ac809ee1b4f253",
    NOT_SIGN_UP_FOR_PARENT: "d-08773b5b2ff0443dacb2d33fe5b92c67",
    SEND_NOTIFICATION_EVENT_BOOKED_COUNSELOR: "d-6a55c2b0c0c7454fb6a5d11a0caa085d",
    SEND_NOTIFICATION_EVENT_BOOKED_PARENT: "d-048f0c7e234a4b57b5f35be00bd3f354",
    SEND_ALERT_ADMIN_PARENT: "d-d87619c058624c0cbb6f36195d06414f",
    SEND_ALERT_ADMIN_COUNSELOR: "d-147d05b8bdca46c6a217514107007408",
    SEND_REMINDER: "d-36cf657966424acda2b6833ea705a7e2",
    REMINDER_ONE_DAY: "d-4f48df487f21409ea1dd696035855f3e",
    REMINDER_BEFORE: "d-36cf657966424acda2b6833ea705a7e2",
    PAYOUT_ALERT:"d-cce948e38c6b449cb01c8e2fb5a5267e",
    RESECHULED_EVENT: "d-20c13e9afb574591acb9b952107fedf2",
    RESECHULED_EVENT_BY_PARENT: "d-64cbdcfea5af4d809eb6fa299cf899ea",
    SEND_ALERT_ADMIN_BOOKED_EVENT:"d-0bcd2bbb452247dc9644cfefcda502be",
    SEND_VERIFICATION_SCHOOL:"d-c7c6f73750774ce083b04355e8e2386d",
    SEND_VERIFICATION_DISTRICT:"d-5384fb20867b441bb6b30db0da42288f",
    SEND_ALERT_ADMIN_INDIVIDUAL_SCHOOL:"d-b732bb86c14c4bf9a9abc97cef8861ea",
    SEND_ALERT_ADMIN_DISTRICT_SCHOOL: "d-388a83172f104141a41e1f5b0d673bca",
    ALERT_PARENT_STUDENT_SCHOOL_SIGNUP:"d-171e5f1149d04e4e996d2923c78e4d68",
    ALERT_SCHOOL_DISTRICT_SCHOOL_SIGNUP:"d-178b45880fe74dc88a2d00fe72d3aa52",
    CONSENT_ALERT_SCHOOL:"d-fd9acbc8814a4edf8b17a0330a620c76",
    CONSENT_DECLINED_ALERT_SCHOOL:"d-84d3b781a6bb4a6bbc114b522a6034cd",
    MILESTONE_ALERT:"d-97db6a5ea3744bba92dc3b91beb0ec98",
    SCHOOL_ADMIN_ALERT:"d-d9f6dafbb7d94c4da27fda33fc95c87d",
    REMINDER_5MINS:"d-f228c546c8a04f83a337f6cd6804bb26",
    CRON_PARENT_AFTER_SIGNUP: 'd-4f3777a3a4fc468597cee8e6f94b1d47',
    PASSWORD_CHANGED_NOTIFICAION: 'd-24951fbbce784fb9bf238c4204bf1e50'
},


  message: {
    something_wrong: "Something went wrong. Please try again.",
    en: {
      //register
      default_error: "Something went wrong. Please try again.",
      param_missing: "Parameters missing.",
      password_match: "Password & Confirm Password does not Match",
      password_length: "Password must be of minimum 6 characters length.",
      email_exist:
        "Email already exist. Please try using another email address.",
      category_exist:
        "Category already exist. Please try using another category name.",
      valid_email: "Please enter valid email.",
      success_register:
        "Registered Successfully. A verification email is sent to your registered email address. Please verify to continue.",
      Category_added_successful: "Category added Successfully. ",
      SubCategory_added_successful: "Sub Category added Successfully. ",
      success_register_vendor:
        "Registered Successfully. Your request has been send to admin for acceptance",
      //login
      invalid_email: "Email doesn't exist. Please try again.",
      invalid_nric: "NRIC doesn't exist. Please try again.",
      delete_account: "Account deleted, Please contact to administrator.",
      wrong_password: "Wrong password. Please try again.",
      email_active_mail:
        "Your Account is not activated, A verification email is sent to your registered email address. Please verify to continue.",
      login_success: "Login success.",
      logout_success: "Logout success.",

      //Forgot/ reset/update password/ change password
      error_verify_email: "Server error while verifying email address.",
      success_verify_email: "Your account has been verified successfully.",
      invalid_token: "Invalid token. Please re-generate forgot password link.",
      error_update_forget_token:
        "Server error while updating forgot password token.",
      success_mail_forget:
        "A password recovery email was sent to your registered email address. Please check your email to change password.",
      failure_mail_forget:
      "Error while sending email. Please try again.",
      error_update_password: "Server error while updating new password.",
      success_update_password: "Password changed successfully!",
      current_password: "Current password matched!",
      current_password_error: "Current password does not match!",
      not_authorized: "User is not authorized",
      invalidImage: "Invalid image please try again later",
      ImageUploadSuccess: "image uploaded successfully.",
      SuccessImageRemove: "Image removed successfully",
      success_mail_BookingRequest: "Your Booking request is send to Vendor",
      ErrorWhileSavingData: "Error occured while retrieving data.",
      successRetreivingData: "Sucessfully retreived data.",
      successEditCategory: "Category edit successfully.",
      successEditSubCategory: "Sub-Category edit successfully.",
      SuccessSavingData: "Data has been saved Succesfully.",
      SuccessUpdateData: "Data has been updated succesfully.",
      successUpdatedProfile: "Data has been updated succesfully.",
      all_Category_Data: "All Category Data",
      category_created: "Category Created Successfully.",
      merchant_created: "Merchant Created Successfully.",
      partner_created: "Partner Created Successfully.",
      event_created: "Event Created Successfully.",
      healthModule_created: "Health Module Created Successfully.",
      healthCategory_created: "Health Category Created Successfully.",
      healthSpecific_created: "Health Specific Created Successfully.",
      success_mail_appointment:
        "Your appointment request has beed Send Successfully.",
      success_advertisement: "Successfully Saved.",
      noDataFound: "No Data Found.",
      Services_created: "Services Created Successfully.",
      tab_created: "Tab Created Successfully.",
      service_created: "Service Created Successfully",
      package_created: "Package Created Successfully",
      query_resonded_successfully: "Success.",
      error_update: "Server error while updating record.",
      success_update: "Record updated Successfully",  
      alreadyExist: "Name Aready Exist",
      success_contactUs: "You message has been posted to Admin.",
      pinrequired: "Pin is required",
      customer_edit_success: "edit data successfully",
      stripe_connected_already  : "Your stripe account is connected",
      invalid_login_credential  : "Invalid Login Credentials",
      purchase_video_session : 'Please purchase more video session in order to book a counselor',
      counselor_not_available: 'Invalid time slot!',
      counselor_booked: "The counselor is already booked on your selected time."
    }
  }
};
