var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
var crypto = require("crypto");
var secret = require("../config/secret");
var jwt = require("jsonwebtoken");
var Schema = mongoose.Schema;

var kidsemotionSchema = new Schema(
  {
    kidId: { type: String, default: null },
    kidName: { type: String, default: null },
    kidParentId: { type: String, default: null },
    emotion: { type: String, default: null },
    role: {
      type: Number,
      enum: [1, 2, 3, 4], //Admin 1, Councellor 2, Parent 3, child 4 
      default: 4
    },
    isDeleted: { type: Boolean, default: false },    
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

var kidsEmotionDetails = mongoose.model("kidsEmotionDetails", kidsemotionSchema);
module.exports = kidsEmotionDetails;
