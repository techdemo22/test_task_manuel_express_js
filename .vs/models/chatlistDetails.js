var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var chatlistSchema = new Schema(
  {
    counselorId: { type: String, default: null },
    parentId: { type: String, default: null },
    latestMessage: { type: String, default: null },
    counselorfirstName: { type: String, default: null },
    counselorlastName: { type: String, default: null },
    parentfirstName: { type: String, default: null },
    parentlastName: { type: String, default: null },
    counselorImage: { type: String, default: null },
    parentImage: { type: String, default: null },
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

var chatlistDetails = mongoose.model("chatlistDetails", chatlistSchema);
module.exports = chatlistDetails;
