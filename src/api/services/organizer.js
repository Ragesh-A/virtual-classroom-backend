const sendMail = require('../utils/mailer');
const { findUserByEmailOrPhone } = require('./user');
const Organization = require('../models/organization');
const User = require('../models/user');

const phoneRegex = /^\d{3}\d{3}\d{4}$/;

exports.createOrganization = async (userId) => {
  const newOrganization = new Organization({ subscriber: userId });
  await newOrganization.save();
  return newOrganization;
};

exports.sendInvitationRequest = async (emailOrPhone, userId, message = '') => {
  const user = await findUserByEmailOrPhone(emailOrPhone);
  const organization = await Organization.findOne({ subscriber: userId });
  const { _id } = organization;
  if (phoneRegex.test(emailOrPhone)) {
    throw new Error('sms service unavailable');
  }
  const subject = 'Invitation to Join as Instructor';
  let html;
  if (message === '') {
    html = `<b>Dear ${user.name}</b><br/><br/>
    We are delighted to invite you to join our organization as an instructor.
    Your expertise and passion for [relevant field] make you an ideal candidate.
    Your contributions will shape the future of our learners,
    and we believe you will thrive in our supportive and collaborative environment.
    Please let us know your decision soon. We look forward to welcoming you to our team.<br/>
    if you are interested click this link ${process.env.REACT_IP}/verify/instructor/${user.uuid}/join/${_id}
    <br/><br/>
   Best regards,<br/>
  ${organization.name ? organization.name : ''}`;
  }
  const isSended = await sendMail(emailOrPhone, subject, message, html);
  return isSended;
};

exports.acceptInvitation = async (userId, instructorId, organizationId) => {
  const user = await User.findOne({ uuid: instructorId });
  if (!user) throw new Error('User not found');
  const { _id } = user;
  if (userId !== _id.toString()) throw new Error('unauthorized');
  const isUpdated = await Organization.updateOne(
    { _id: organizationId },
    { $addToSet: { lectures: _id } },
  );
  if (!isUpdated.matchedCount) throw new Error('un able to accept the request');
  if (!isUpdated.modifiedCount) throw new Error('You are already in accepted');
  return { message: 'successfully accepted the request' };
};

exports.findInstructors = async (subscriber) => {
  const instructors = await Organization.findOne({ subscriber }).populate('instructors');
  return instructors;
};
