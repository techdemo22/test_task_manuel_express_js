var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var commentSchema = new Schema(
  {
    videoId: { type: String, default: null },
    userCommentId: { type: String, default: null },
    commentorImage: { type: String, default: null },
    userParentCommentId: { type: String, default: null },
    comment: { type: String, default: null },
    firstName: { type: String, default: null },
    like: { type: Number, default: 0 },
    // commentedON: { type: Date},//UTC date/time generated auto
    attachments: [{
        url: { type: String, default: null },
        fileType: { type: String, default: "text" },
        fileName: { type: String },
        from: { type: String},
        size: { type: String},
    }],
    isEdited: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }    
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

var commentDetails = mongoose.model("commentDetails", commentSchema);
module.exports = commentDetails;
