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

exports.classUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(20),
  description: Joi.string(),
  instructor: Joi.string().allow(null),
  image: Joi.string(),
});

exports.classSchema = Joi.object({
  name: Joi.string().min(2).max(20).required(),
  section: Joi.string().min(0),
  description: Joi.string().min(0),
  image: Joi.string().min(0),
  instructor: Joi.string().min(0),
});

exports.announcementData = Joi.object({
  title: Joi.string().required().min(5).max(25)
    .messages({
      'string.base': 'Title must be string',
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least {#limit} character',
      'string.max': 'Title must not exceed {#limit} character',
    }),
  description: Joi.string().required().min(5).max(250)
    .messages({
      'string.base': 'Description must be string',
      'string.empty': 'Description is required',
      'string.min': 'Description must be at least {#limit} characters',
    }),
  classes: Joi.array().items(Joi.string().required())
    .messages({
      'array.base': 'Classes must be an array',
      'array.empty': 'At least one class is required',
    }),
  icon: Joi.string().required().trim()
    .messages({
      'string.base': 'Icon must be a string',
      'string.empty': 'Icon is required',
    }),
  announceAt: Joi.date().required()
    .messages({
      'date.base': 'AnnounceAt must be a valid date',
      'date.empty': 'AnnounceAt is required',
    }),
  theme: Joi.string().required().messages({
    'string.base': 'Theme must be string',
    'string.empty': 'Theme is required',
  }),
  action: Joi.string().min(0),
});
