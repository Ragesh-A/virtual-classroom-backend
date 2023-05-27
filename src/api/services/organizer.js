const sendMail = require('../utils/mailer');
const { findUserByEmailOrPhone } = require('./user');
const Organization = require('../models/organization');

const phoneRegex = /^\d{3}\d{3}\d{4}$/;

exports.createOrganization = async (userId) => {
  const newOrganization = new Organization({ subscriber: userId });
  await newOrganization.save();
  return newOrganization;
};

exports.sendJoinRequest = async (emailOrPhone, userId, message = '') => {
  const user = await findUserByEmailOrPhone(emailOrPhone);
  const organization = await Organization.findOne({ subscriber: userId });
  if (phoneRegex.test(emailOrPhone)) {
    throw new Error('sms service unavailable');
  }
  const subject = 'Invitation to Join as Instructor';
  let html;
  if (message === '') {
    html = `<b>Dear ${user.name}</b><br/>,
    We are delighted to invite you to join our organization as an instructor.
    Your expertise and passion for [relevant field] make you an ideal candidate.
    Your contributions will shape the future of our learners,
    and we believe you will thrive in our supportive and collaborative environment.
    Please let us know your decision soon. We look forward to welcoming you to our team.
    <br/><br/>
   Best regards,<br/>
  ${organization.name ? organization.name : ''}`;
  }
  const isSended = await sendMail(emailOrPhone, subject, message, html);
  return isSended;
};
