var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var bookedSchema = new Schema(
  {
    counselorId: { type: String, default: null },
    parentId: { type: String, default: null },
    sessionlink: { type: String, default: null },
    roomid: { type: String, default: null },
    description: { type: String, default: null },
    location: { type: String, default: null },
    counselorFirstName: { type: String, default: null },
    counselorlastName: { type: String, default: null },
    counseloremail: { type: String, default: null },
    parentemail: { type: String, default: null },
    parentName: { type: String, default: null },
    parentfirstName: { type: String, default: null },
    parentlastName: { type: String, default: null },
    counselorImage: { type: String, default: null },
    actualEventDate: { type: Date, default: null },
    extraComment: { type: String, default: null },
    eventdate: { type: String, default: null },
    parentImage: { type: String, default: null },
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
    isreschedule: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

var sessionBookedDetails = mongoose.model("sessionBookedDetails", bookedSchema);
module.exports = sessionBookedDetails;
