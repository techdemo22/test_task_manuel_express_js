var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
var crypto = require("crypto");
var secret = require("../config/secret");
var jwt = require("jsonwebtoken");
var Schema = mongoose.Schema;

var AvialableSchema = new Schema(
  {
    parentId: { type: String, default: null },
    counselorId: { type: String, default: null },
    bookingDate: { type: String, default: null },
    timeSlot: { type: String, default: null },
    parentFirstName: { type: String, default: null },
    reasonForRescheduling: { type: String, default: null },
    // emotion: { type: String, default: null },
    // videoStatus:  { type: String, default: 'Pending' },
    status: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },    
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

var avialibityDetails = mongoose.model("avialibityDetails", AvialableSchema);
module.exports = avialibityDetails;
