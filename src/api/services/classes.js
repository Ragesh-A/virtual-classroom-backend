const Classes = require('../models/class');
const Enrolment = require('../models/classEnrollment');

exports.getAllUserClasses = async (userId) => {
  let enrolledClasses = await Enrolment.find({ students: { $in: [userId] } }).populate('classId');
  let createdClasses = await Classes.find({ createdBy: userId });
  if (!enrolledClasses) enrolledClasses = [];
  if (!createdClasses) createdClasses = [];
  return { ...enrolledClasses, ...createdClasses };
};

exports.allClasses = async () => {
  const classes = await Classes.find();
  if (!classes) throw new Error('something went wrong');
  return classes;
};
