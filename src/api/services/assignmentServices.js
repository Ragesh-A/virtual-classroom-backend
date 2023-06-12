/* eslint-disable no-underscore-dangle */
const Assignment = require('../models/assignment.schema');
const Submissions = require('../models/submissionModel');

exports.createAssignment = async (classes, title, description, dueDate, createdBy, image = '') => {
  const newAssignment = new Assignment({
    title,
    description,
    dueDate,
    createdBy,
    classes,
    image,
  });
  await newAssignment.save();
  return newAssignment;
};

exports.allAssignments = async (classId, student, q) => {
  const assignments = await Assignment.find({ classes: classId });
  const ids = assignments.map((assignment) => assignment._id);
  const submissions = await Submissions.find({ student, assignmentId: { $in: ids } }).populate('assignmentId');

  let result = [];
  switch (q) {
    case 'pending':
      result = assignments.filter((assignment) => (!submissions.some((submission) => (
        submission.assignmentId._id.toString() === assignment._id.toString())
         && assignment.dueDate >= new Date())));
      break;

    case 'missed':
      result = assignments.filter((assignment) => !submissions.some((submission) => (
        submission.assignmentId._id.toString() === assignment._id.toString())));
      break;

    case 'completed':
      result = submissions;
      break;
    default: result = assignments;
  }

  return result;
};

exports.getAssignment = async (_id) => {
  const assignment = await Assignment.findOne({ _id });
  if (!assignment) throw new Error('no assignment found');
  return assignment;
};

exports.update = async (_id, payload) => {
  const isUpdated = await Assignment.updateOne({ _id }, payload, { new: true });
  return isUpdated;
};

exports.allSubmissions = async (classId, assignmentId) => {
  let submissions = await Submissions.find({ assignmentId }).populate({ path: 'student', select: '-password' });
  if (!submissions) submissions = [];
  return submissions;
};

exports.findBySubmissionId = async (_id) => {
  const submission = await Submissions.findOne({ _id });
  if (!submission) throw new Error('could not find the submission');
  return submission;
};

exports.createSubmission = async (student, assignmentId, answer) => {
  const alreadySubmitted = await Submissions.findOne({ student, assignmentId });
  if (alreadySubmitted) throw new Error('already submitted');
  const newSubmission = new Submissions({ assignmentId, student, answer });
  const isSubmitted = await newSubmission.save();
  return isSubmitted;
};
