var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SubscriptionSchema = new Schema(
        {
            paymentId:{
                type: String,
                default: null
            },
            parentId:{
                type: String,
                default: null
            },
            planType:{
                type: String,
                default: null
            },
            email:{
                type: String,
                default: null
            },
            kidId:{
                type: String,
                default: null
            },
            isDeleted: {
                type: Boolean,
                default: false
            },
            price: {
                type: Number
            },
            role: {
                type: Number
            },
            step: {
                type: Number
            },
            added_at: {
                type: Date,
                default: Date.now
            },
            created_at: {
                type: Date,
                default: Date.now
            },
            updated_at: {
                type: Date,
                default: Date.now
            },
            avaliable_videos: {
                type: Number,
                default: null
            },
            watch_videos: {
                type: Number,
                default: null
            },
            total_videos: {
                type: Number,
                default: null
            },
            active:{
                type: Boolean,
                default: true
            },
        }
);

var SubscriptionDetails = mongoose.model("SubscriptionDetails", SubscriptionSchema);
module.exports = SubscriptionDetails;
