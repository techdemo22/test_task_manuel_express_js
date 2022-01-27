var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
var crypto = require("crypto");
var secret = require("../config/secret");
var jwt = require("jsonwebtoken");
var Schema = mongoose.Schema;

var uploadSchema = new Schema(
  {
    postCreateId: { type: String, default: null },
    councellorId: { type: String, default: null },
    parentId: { type: String, default: null },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    email: { type: String, default: null },
    role: {
      type: Number,
      enum: [1, 2, 3, 4], //Admin 1, Councellor 2, Parent 3, child 4 
      default: 2
    },
    videoPath: { type: String, default: null },
    tags: { type: Array, default: null },
    description: { type: String, default: null },
    emotion: { type: String, default: null },
    ageRange: [{
      name: { type: String},
      id: { type: Number}
    }],
    therapyType: [{
      name: { type: String},
      id: { type: Number}
    }],
    videoStatus:  { type: String, default: 'Pending' },
    status: { type: Boolean, default: false },
    thumbnail: { type: String, default: null },
    totalLikes: {type: Number , default: 0 },
    totalComments: {type: Number , default: 0 },
    totalViews: {type: Number , default: 0 },
    image: { type: String, default: null },
    parentName: { type: String, default: null },
    parentEmail: { type: String, default: null },
    childName: { type: String, default: null },
    flag: { type: Boolean, default: false },
    videoName: { type: String, default: null },
    isChildrenUpload: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },    
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

var videoUpload = mongoose.model("videoUpload", uploadSchema);
module.exports = videoUpload;
