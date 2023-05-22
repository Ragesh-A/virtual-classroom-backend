const {
  registerUser, loginUser, verifyLink, otp, resetUserPassword,
} = require('../services/auth');
const { filterUserData, generateUid } = require('../utils/helper');
const { generateToken } = require('../utils/jwt');
const { signupSchema, loginSchema } = require('../validations/validation');
const mail = require('../services/mailService');
const { findUserByEmailOrPhone } = require('../services/user');

exports.signup = async (req, res) => {
  try {
    const { value, error } = signupSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);
    const uuid = generateUid();
    const user = await registerUser(value, uuid);
    if (!user) throw user;
    await mail.sendVerification(user);
    res.json({ success: 'verification mail sended' });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { value, error } = loginSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);
    let user = await loginUser(value.emailOrPhone, value.password);
    if (!user) throw new Error('invalid user credentials');
    const { _id, isAdmin } = user;
    const token = await generateToken({ _id, isAdmin });
    user = filterUserData(user);
    res.json({ success: { authentication: token, user } });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.emailVerification = async (req, res) => {
  try {
    const { userId, uuid } = req.body;
    const result = await verifyLink(userId, uuid);
    if (!result) throw new Error('can not verify the user');
    res.json({ success: { status: true } });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.resetPasswordRequest = async (req, res) => {
  try {
    const { emailOrPhone } = req.body;
    await findUserByEmailOrPhone(emailOrPhone);
    const sendedOtp = await mail.requestResetPassword(emailOrPhone);
    if (!sendedOtp) throw new Error('failed to send email');
    otp(emailOrPhone, sendedOtp);
    res.json({ success: 'otp sended' });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password, emailOrPhone } = req.body;
    await resetUserPassword(req.body.otp, emailOrPhone, password);
    res.json({ success: 'password updated' });
  } catch (error) {
    res.json({ error: error.message });
  }
};
