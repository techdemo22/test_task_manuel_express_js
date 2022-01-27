var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var slotSchema = new Schema(
  {
    counselorId: { type: String, default: null },
    description: { type: String, default: null },
    location: { type: String, default: null },
    email: { type: String, default: null },
    eventdate: { type: String, default: null },
    ischecked: { type: Boolean, default: false },
    slotlist: [{
      slot:  { type: String, default: null },
      slotTime: {type: Date},
      slotformat: { type: String, default: null },
      status: { type: String, default: null },
      hrs: { type: String, default: null },
      min: { type: String, default: null },
      id: { type: String, default: null },
      zone: { type: String, default: null },
      setTime: { type: String, default: null },
    }],
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

var slotDetails = mongoose.model("slotDetails", slotSchema);
module.exports = slotDetails;
