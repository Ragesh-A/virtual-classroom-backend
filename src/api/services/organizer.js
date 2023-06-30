const sendMail = require('../utils/mailer');
const { findUserByEmailOrPhone } = require('./user');
const Organization = require('../models/organization');
const User = require('../models/user');
const Class = require('../models/class');

const phoneRegex = /^\d{3}\d{3}\d{4}$/;

exports.createOrganization = async (userId) => {
  const newOrganization = new Organization({ subscriber: userId });
  await newOrganization.save();
  return newOrganization;
};

exports.sendInvitationRequest = async (emailOrPhone, userId, message = '') => {
  const user = await findUserByEmailOrPhone(emailOrPhone);
  const organization = await Organization.findOne({ subscriber: userId });

  const currentDate = new Date();
  const sevenDaysLater = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);

  // is mail already sended or not
  let isAlreadySended = false;
  organization.waiting.forEach((waiting) => {
    if (waiting.user === emailOrPhone) {
      isAlreadySended = true;
      if (Date.now() >= waiting.expire) {
        Organization.updateOne(
          { subscriber: userId, 'waiting.user': emailOrPhone },
          { $set: { 'waiting.$.expire': sevenDaysLater } },
        );
      }
    }
  });

  if (isAlreadySended) return { message: 'invitation already sended' };

  const isUpdated = await Organization.updateOne(
    { subscriber: userId },
    { $push: { waiting: { user: emailOrPhone, expire: sevenDaysLater } } },
  );
  if (isUpdated.nModified === 0) {
    throw new Error('failed to execute');
  }
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
  } else {
    // eslint-disable-next-line no-param-reassign
    message += ` if you are interested click this link ${process.env.REACT_IP}/verify/instructor/${user.uuid}/join/${_id}`;
  }
  const isSended = await sendMail(emailOrPhone, subject, message, html);
  if (!isSended) throw new Error('failed to sent');
  return { message: 'invitation is sended', user: { user: emailOrPhone, expire: sevenDaysLater } };
};

exports.acceptInvitation = async (userId, instructorId, organizationId) => {
  const user = await User.findOne({ uuid: instructorId });
  if (!user) throw new Error('User not found');
  const { _id, emailOrPhone } = user;
  if (userId !== _id.toString()) throw new Error('unauthorized');
  const expired = await this.checkInvitation(emailOrPhone, organizationId);
  if (expired) throw new Error('Link expired');
  const isUpdated = await Organization.updateOne(
    { _id: organizationId },
    { $addToSet: { instructors: _id }, $pull: { waiting: { user: emailOrPhone } } },
  );
  if (!isUpdated.matchedCount) throw new Error('Unable to accept the request');
  if (!isUpdated.modifiedCount) throw new Error('You have already in accepted');
  return { message: 'Successfully accepted the request' };
};

exports.findInstructors = async (subscriber) => {
  const instructors = await Organization.findOne({ subscriber }).populate('instructors');
  if (!instructors) throw new Error('Failed to fetch the data.');

  instructors.waiting = instructors.waiting.filter((e) => {
    if (e.expire < Date.now()) {
      return false;
    }
    return true;
  });

  await Organization.updateOne({ subscriber }, { waiting: instructors.waiting });

  return { instructors: instructors.instructors, waiting: instructors.waiting };
};

exports.removeInstructor = async (subscriber, instructorId) => {
  const isRemoved = await Organization.updateOne(
    { subscriber },
    { $pull: { instructors: instructorId } },
  );
  if (!isRemoved.modifiedCount) throw new Error('unable to remove the instructor');
  return { message: 'removed successfully' };
};

exports.resetInstructor = async (subscriber, instructorId) => {
  const isReset = await Class.updateMany(
    { createdBy: subscriber, instructor: instructorId },
    { $set: { instructor: subscriber } },
  );
  return isReset;
};

exports.removeFromWaitingList = async (user, subscriber) => {
  const isRemoved = await Organization.updateOne(
    { subscriber },
    { $pull: { waiting: { user } } },
  );
  if (!isRemoved.modifiedCount) throw new Error('unable to remove the instructor');
  return { message: 'removed successfully' };
};

exports.checkInvitation = async (emailOrPhone, organizationId) => {
  const organization = await Organization.findOne({ _id: organizationId, 'waiting.user': emailOrPhone });
  if (!organization) throw new Error('not found your invitation');

  let isExpired = false;
  organization.waiting = organization.waiting.filter((e) => {
    if (e.expire < Date.now() && e.user === emailOrPhone) {
      isExpired = true;
      return false;
    }
    return true;
  });

  await organization.save();
  return isExpired;
};
