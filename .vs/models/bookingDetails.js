var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var bookingSchema = new Schema(
  {
    loggedInUserId: { type: String, default: null },
    googleAccessToken: { type: String, default: null },
    googleCalenderId: { type: String, default: null },
    refreshToken: { type: String, default: null },
    role: {
      type: Number,
      enum: [1, 2, 3, 4], //Admin 1, Councellor 2, Parent 3, child 4 
      default: 2
    },
    email: { type: String, default: null },
    expireTime: { type: Date, default: null },
    expireAt: { type: String, default: null },
    calendarList: [{
      calendarId:  { type: String, default: null },
      CalendarName: { type: String, default: null },
    }],
    outlookAccessToken: { type: String, default: null },
    outlookCalenderId: { type: String, default: null },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

var bookingDetails = mongoose.model("bookingDetails", bookingSchema);
module.exports = bookingDetails;
