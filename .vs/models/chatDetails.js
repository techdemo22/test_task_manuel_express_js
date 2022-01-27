var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var chatSchema = new Schema(
  {
    from: { type: String, default: null },
    to: { type: String, default: null },
    message: { type: String, default: null },
    chatedOn: { type: Date},//UTC date/time generated auto
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

var chatDetails = mongoose.model("chatDetails", chatSchema);
module.exports = chatDetails;
