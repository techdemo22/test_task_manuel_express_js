var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
var crypto = require("crypto");
var secret = require("../config/secret");
var jwt = require("jsonwebtoken");
var Schema = mongoose.Schema;

var viewSchema = new Schema(
  {
    videoId: { type: String, default: null },
    childId: { type: String, default: null },
    parentId: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },    
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

var viewDetails = mongoose.model("viewDetails", viewSchema);
module.exports = viewDetails;