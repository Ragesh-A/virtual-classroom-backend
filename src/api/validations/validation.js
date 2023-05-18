const Joi = require('joi');

function isEmailOrPhone(value, helpers) {
  const phoneRegex = /^\d{3}\d{3}\d{4}$/;
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  if (phoneRegex.test(value)) {
    return value;
  }
  if (emailRegex.test(value)) {
    return value;
  }
  return helpers.error('any,invalid');
}

exports.signupSchema = Joi.object({
  name: Joi.string().min(2).required(),
  emailOrPhone: Joi.string().custom((value, helpers) => isEmailOrPhone(value, helpers)),
  password: Joi.string().min(5).required(),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')),
});

exports.loginSchema = Joi.object({
  emailOrPhone: Joi.string().custom((value, helpers) => isEmailOrPhone(value, helpers)),
  password: Joi.string().min(5).required(),
});