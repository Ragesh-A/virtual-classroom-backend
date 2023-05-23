const Classes = require('../models/class');
const Enrolment = require('../models/classEnrollment');
const { generateId, filterClass } = require('../utils/helper');

exports.getAllUserClasses = async (userId) => {
  const enrolledClassesPromise = async () => Enrolment.find({ students: { $in: [userId] } }).populate('classId');
  const createdClassesPromise = async () => Classes.find({ createdBy: userId });
  const [enrolledClassesResult, createdClassesResult] = await Promise.allSettled(
    [enrolledClassesPromise(), createdClassesPromise()],
  );
  const filteredClass = filterClass(enrolledClassesResult.value);
  return [...filteredClass, ...createdClassesResult.value];
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
  const uuid = generateId();
  const newClass = new Classes({
    ...payload,
    uuid,
    createdBy,
  });
  await newClass.save();
  return newClass;
};

async function generateEnrollment(classId) {
  const newEnrollment = new Enrolment({
    classId,
  });
  await newEnrollment.save();
  await newEnrollment.populate('classId');
  return newEnrollment;
}

exports.addIntoClass = async (userId, uuid) => {
  const singleClass = await Classes.findOne({ uuid });
  if (!singleClass) throw new Error('could not find the class');
  const { _id } = singleClass;
  let enrolled = await Enrolment.findOne({ classId: _id }).populate('classId');
  if (!enrolled) {
    enrolled = await generateEnrollment(_id);
  }
  let message = { message: 'You are already in the class', created: false };
  if (!(enrolled.classId.createdBy.toString() === userId)) {
    const isEnrolled = await Enrolment.updateOne(
      { classId: _id },
      { $addToSet: { students: userId } },
    );
    if (isEnrolled.modifiedCount) {
      message = { message: 'You are Joined in the class', created: true, class: enrolled };
    }
  }
  return message;
};
