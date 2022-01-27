"use strict"
const request = require("request");
const sandgridEmailDetails = require("../config/constants").sandgridEmailDetails;


module.exports =  mailer;

function mailer(emailData) {
    let options = {
        method: 'POST',
        url: 'https://api.sendgrid.com/v3/mail/send',
        headers:
        {
            'content-type': 'application/json',
            authorization: `Bearer ${sandgridEmailDetails.SENDGRID_API_CLIENT}`
        },
        body: {
            "personalizations": [
                {
                    "to": [
                        {
                            "email": emailData.receiverEmail,
                            "name": emailData.receiverFullName
                        }
                    ],
                   
                    "dynamic_template_data": emailData.replacementsObj,
                    "subject": emailData.subject
                }
            ],
            "from": {
                "email": process.env.SENDER_EMAIL,
                "name": sandgridEmailDetails.fromFullName,
            },
            "reply_to": {
                "email": process.env.SENDER_EMAIL,
                "name": sandgridEmailDetails.fromFullName,
            },
            "template_id": `${emailData.templateId}`
        },
        json: true
    };

    return new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
}