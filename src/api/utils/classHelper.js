const ClassWaitingList = require('../models/classWaitingList');
const Enrolment = require('../models/classEnrollment');

exports.addIntoWaitingList = async (classId, userId) => {
  const waitingModel = await ClassWaitingList.findOne({ classId });
  if (!waitingModel) {
    const newWaitingModel = new ClassWaitingList({ classId });
    await newWaitingModel.save();
  }
  const updated = await ClassWaitingList.updateOne({ classId }, { $addToSet: { waiting: userId } });
  if (updated.modifiedCount) {
    return { message: 'successful requested to class' };
  }
  return { message: 'you are already requested into class ' };
};

exports.generateEnrollment = async (classId) => {
  const enrollment = await Enrolment.findOne({ classId });
  if (enrollment) return enrollment;
  const newEnrollment = new Enrolment({ classId });
  newEnrollment.save();
  return newEnrollment;
};

exports.enrollStudent = async (classId, studentId) => {
  const isAdded = await Enrolment.updateOne({ classId }, { $addToSet: { students: studentId } });
  if (isAdded.modifiedCount) {
    await ClassWaitingList.updateOne({ classId }, { $pull: { waiting: studentId } });
    return { message: 'Added into the class' };
  }
  return { message: 'failed to add into class' };
};

exports.enrolledStudents = async (classId) => {
  const students = await Enrolment.findOne({ classId }).populate('students');
};
