var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PaymentSchema = new Schema(
        {
            paymentIntentId:{
                type: String,
                default: null
            },
            parentId:{
                type: String
            },
            object:{
                type: String,
                default: null
            },
            isDeleted: {
                type: Boolean,
                default: false
            },
            amount: {
                type: Number
            },
            canceled_at: {
                type: Date
            },
            added_at: {
                type: Date,
                default: Date.now
            },
            cancellation_reason: {
                type: String,
                default: null
            },
            capture_method: {
                type: String,
                default: null
            },
            client_secret: {
                type: String,
                default: null
            },
            confirmation_method: {
                type: String,
                default: null
            },
            created :{
                type: Date
            },
            currency: {
                type: String,
                default: 'usd'
            },
            description: {
                type: String,
                default: null
            },
           last_payment_error: {
                type: String,
                default: null
            },
            livemode: {
                type: Boolean,
                default: false
            },
            next_action:{
                type: String,
                default: null
            },
            payment_method:{
                type: String,
                default: null
            },
            payment_method_types :[],
            receipt_email:{
                type: String,
                default: null
            },
            setup_future_usage:{
                type: String,
                default: null
            },
            shipping:{
                address:{
                    city:{
                        type: String,
                        default: null
                    },
                    country:{
                        type: String,
                        default: null
                    },
                    line1:{
                        type: String,
                        default: null
                    },
                    line2:{
                        type: String,
                        default: null
                    },
                    postal_code:{
                        type: Number,
                        default: null
                    },
                    state:{
                        type: String,
                        default: null
                    },
              },
                carrier:{
                    type: String,
                    default: null
                },
                name:{
                    type: String,
                    default: null
                },
                phone:{
                    type: Number,
                    default: null
                },
                tracking_number:{
                    type: Number,
                    default: null
                },
            },
            source:{
                type: String,
                default: null
            },
            status:{
                type: String,
                default: null
            },
        }
);

var PaymentDetails = mongoose.model("PaymentDetails", PaymentSchema);
module.exports = PaymentDetails;
