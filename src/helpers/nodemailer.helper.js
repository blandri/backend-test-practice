/* eslint-disable object-shorthand */
/* eslint-disable require-jsdoc */
const mailgunTransport = require('nodemailer-mailgun-transport')
const nodemailer = require('nodemailer');
require('dotenv').config();

export default async function main(receiver, subject, text, context) {
    // Configure transport options
    const mailgunOptions = {
      auth: {
        api_key: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN,
      }
    }
    const transport = mailgunTransport(mailgunOptions)
    // EmailService
   
    const emailClient = nodemailer.createTransport(transport)

    const info = await emailClient.sendMail({
            from: 'landrybrok3@gmail.com',
            to:receiver,
            subject,
            text,
            html:context
        })
        .catch((error) => {console.log('===>', error)
            throw Error(error);
        });

    console.log('Message sent: %s', info.messageId);

    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}
