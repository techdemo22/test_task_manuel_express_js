var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var stripeSchema = new Schema(
  {
        userId: { type: String, default: null },
        userEmail: { type: String, default: null },
        role: {
            type: Number,
            enum: [1, 2, 3, 4], //Admin 1, Councellor 2, Parent 3, child 4 
            default: 2
        },
        token_type: { type: String, default: null },
        stripe_publishable_key: { type: String, default: null },
        scope: { type: String, default: null },
        livemode: { type: Boolean, default: false },
        stripe_user_id: { type: String, default: null },
        refresh_token: { type: String, default: null },
        access_token: { type: String, default: null },
        isDeleted: { type: Boolean, default: false }    
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

var stripeDetails = mongoose.model("stripeDetails", stripeSchema);
module.exports = stripeDetails;
