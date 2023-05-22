const Classes = require('../models/class');
const Enrolment = require('../models/classEnrollment');

exports.getAllUserClasses = async (userId) => {
  let enrolledClasses = await Enrolment.find({ students: { $in: [userId] } }).populate('classId');
  let createdClasses = await Classes.find({ createdBy: userId });
  if (!enrolledClasses) enrolledClasses = [];
  if (!createdClasses) createdClasses = [];
  return [...enrolledClasses, ...createdClasses];
};

exports.allClasses = async () => {
  const classes = await Classes.find();
  if (!classes) throw new Error('something went wrong');
  return classes;
};

exports.findOne = async (classId) => {
  const singleClass = await Classes.findOne({ _id: classId });
  return singleClass;
};

exports.updateOne = async (classId, payload) => {
  const updatedClass = await Classes.updateOne({ _id: classId, payload });
  return updatedClass;
};

exports.create = async (payload, createdBy) => {
  if (!payload.instructor) {
    // eslint-disable-next-line no-param-reassign
    payload.instructor = createdBy;
  }
  const newClass = new Classes({
    ...payload,
    createdBy,
  });
  await newClass.save();
  return newClass;
};
