const nodemailer = require("nodemailer")

const sendMail = async (subject, message, send_to, sent_from, reply_to) => {

    // Create Email transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass:  process.env.EMAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // Options for sending E-Mail
    const options = {
        from: sent_from,
        to: send_to,
        replyTo: reply_to,
        subject: subject,
        html: message,
    }

    // Send e-mail
    const info = await transporter.sendMail(options, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }
    })
    
};

module.exports = sendMail