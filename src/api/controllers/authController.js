const { registerUser, loginUser } = require('../services/auth');
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
    const user = loginUser(...value);
    if (!user) throw new Error('invalid user credentials');
    const token = await generateToken(user);
    res.json({ success: { authentication: token } });
  } catch (error) {
    res.json({ error: error.message });
  }
};
