var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
var crypto = require("crypto");
var secret = require("../config/secret");
var jwt = require("jsonwebtoken");
var Schema = mongoose.Schema;

var AftersessionSchema = new Schema(
  {
    parentId: { type: String, default: null },
    counselorId: { type: String, default: null },
    roomid: { type: String, default: null },
    sesssiontime: { type: Date },
    slotBooked: [{
        slot: { type: String, default: null },
        slotformat: { type: String, default: null },
        slotTime: { type: Date, default: null },
        status: { type: String, default: null },
        hrs: { type: String, default: null },
        min: { type: String, default: null },
        id: { type: String, default: null },
        zone: { type: String, default: null },
        setTime: { type: String, default: null },
      }],
    notetitle: { type: String, default: null },
    notemessage: { type: String, default: null },
    notetitleForParent: { type: String, default: null },
    notemessageForParent: { type: String, default: null },
    callaudio: { type: String, default: null },
    callvideo: { type: String, default: null },
    sessionrating:  { type: String, default: null },
    isDeleted: { type: Boolean, default: false },    
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

var AftersessionDetails = mongoose.model("AftersessionDetails", AftersessionSchema);
module.exports = AftersessionDetails;
