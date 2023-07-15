const sendMail = require('../utils/mailer');

const phoneRegex = /^\d{3}\d{3}\d{4}$/;
const app = process.env.REACT_IP;

exports.sendVerification = async (user, senderAPP = app) => {
  const { uuid, emailOrPhone, _id } = user;
  if (phoneRegex.test(emailOrPhone)) {
    throw new Error('OTP verification not available');
  }
  const message = `${senderAPP}/auth/verify-email/${_id}/${uuid}`;
  await sendMail(emailOrPhone, 'Email verification', message);
};

exports.requestResetPassword = async (emailOrPhone) => {
  if (phoneRegex.test(emailOrPhone)) {
    throw new Error('sms verification not available');
  }
  const otp = Math.floor(Math.random() * 9000) + 1000;
  await sendMail(emailOrPhone, 'OTP', `${otp}`);
  return otp;
};

exports.sendMail = async (sender, receiver, message) => {
  if (!message || !sender) throw new Error('invalid data');
  message =  `from: ${sender} \n ${message  }`
  const response = await sendMail(receiver, 'contact', message,)
  return response ? true : false
}
