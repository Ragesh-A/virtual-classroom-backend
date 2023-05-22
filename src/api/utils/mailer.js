// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require('nodemailer');

const { APP_EMAIL, APP_PASS, APP_NAME } = process.env;

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  auth: {
    user: APP_EMAIL,
    pass: APP_PASS,
  },
});

// eslint-disable-next-line consistent-return
const sendMail = async (receiver = '', subject = '', text = '', html = '') => {
  try {
    const info = await transporter.sendMail({
      from: `${APP_NAME} ${APP_EMAIL}`,
      to: receiver,
      subject,
      text,
      html,
    });
    console.log(info);
    return info.messageId;
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendMail;
