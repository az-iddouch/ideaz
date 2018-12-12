const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const exphbs = require('express-handlebars');
const htmlToText = require('nodemailer-html-to-text').htmlToText;

let transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  //secure: true, // true for 465,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

var opts = {
  viewEngine: exphbs,
  viewPath: './views/mail/',
  extName: '.handlebars'
};

transporter.use('compile', hbs(opts));
transporter.use('compile', htmlToText());

exports.send = async options => {
  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Ideaz support 👻" <support@ideaz.io>', // sender address
    to: options.user.email, // list of receivers
    subject: options.subject, // Subject line
    template: options.filename,
    context: {
      options: options
    }
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  });
};
