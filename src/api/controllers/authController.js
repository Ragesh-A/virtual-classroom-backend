const { registerUser, loginUser } = require('../services/auth');
const { filterUserData } = require('../utils/helper');
const { generateToken } = require('../utils/jwt');
const { signupSchema, loginSchema } = require('../validations/validation');

exports.signup = async (req, res) => {
  try {
    const { value, error } = signupSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);
    const user = await registerUser(value);
    if (!user) throw user;
    res.json({ success: 'successful created account' });
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
